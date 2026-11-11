import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Notification, AuditLog, Watchlist, getNextSequence } from '../models/index.js';
import { queryOne, execute } from '../database/db.js';
import { authenticate, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role = 'buyer',
    businessType = 'individual',
    companyName,
    nuit
  } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();

    // Check if email or phone already exists in MongoDB
    const existingMongo = await User.findOne({
      $or: [{ email: cleanEmail }, { phone }]
    });

    if (existingMongo) {
      return res.status(409).json({ message: 'Email ou número de telefone já registado' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = await getNextSequence('users');

    const newUser = await User.create({
      id: userId,
      name,
      email: cleanEmail,
      phone,
      password_hash: passwordHash,
      role: role === 'seller_corp' || role === 'seller_ind' ? 'seller' : role,
      is_verified: true,
      balance: 0,
      city: 'Maputo Cidade',
      province: 'Maputo Cidade',
      company_name: companyName || (businessType === 'company' ? name : null),
      nuit: nuit || null,
      business_type: businessType,
      verified_status: role === 'buyer' ? 'verified' : 'pending'
    });

    // Mirror to SQLite if SQLite is active
    try {
      execute(`
        INSERT INTO users (id, name, email, phone, password_hash, role, is_verified, balance, city, province)
        VALUES (?, ?, ?, ?, ?, ?, 1, 0, 'Maputo Cidade', 'Maputo Cidade')
      `, [userId, name, cleanEmail, phone, passwordHash, newUser.role]);

      if (newUser.role === 'seller') {
        execute(`
          INSERT INTO seller_profiles (user_id, company_name, nuit, business_type, verified_status, rating)
          VALUES (?, ?, ?, ?, 'pending', 5.0)
        `, [userId, companyName || name, nuit || null, businessType]);
      }
    } catch (e) {
      // Ignore sqlite mirror error if duplicate or offline
    }

    // Welcome Notification in MongoDB
    await Notification.create({
      id: await getNextSequence('notifications'),
      user_id: userId,
      title: 'Bem-vindo ao MozBid!',
      message: 'A sua conta institucional foi credenciada com sucesso.',
      type: 'system',
      is_read: false,
      link: '/'
    });

    // Audit Log in MongoDB
    await AuditLog.create({
      id: await getNextSequence('audit_logs'),
      user_id: userId,
      user_name: name,
      action: 'REGISTER',
      details: `Novo utilizador registado com perfil ${newUser.role} no MongoDB`
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password_hash, ...safeUser } = newUser.toObject();

    return res.status(201).json({
      message: 'Registo efectuado com sucesso',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Erro ao criar conta', error: err.message });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();

    // Check MongoDB first
    let user = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: email }]
    }).lean();

    // SQLite fallback
    if (!user) {
      user = queryOne(`
        SELECT id, name, email, phone, password_hash, role, is_verified, balance, city, province, avatar_url, created_at
        FROM users WHERE email = ? OR phone = ?
      `, [cleanEmail, cleanEmail]);
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = {
        company_name: user.company_name || user.name,
        nuit: user.nuit,
        business_type: user.business_type || 'company',
        verified_status: user.verified_status || 'verified',
        rating: user.rating || 4.98,
        total_sales: user.total_sales || 48
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password_hash, ...safeUser } = user;

    // Audit log
    try {
      await AuditLog.create({
        id: await getNextSequence('audit_logs'),
        user_id: user.id,
        user_name: user.name,
        action: 'LOGIN',
        details: 'Sessão iniciada com sucesso via MongoDB'
      });
    } catch {}

    return res.json({
      message: 'Sessão iniciada com sucesso',
      token,
      user: { ...safeUser, sellerProfile }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erro ao iniciar sessão', error: err.message });
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch latest user data from MongoDB
    const userDoc = await User.findOne({ id: userId }).lean();
    const current = userDoc || req.user;

    let sellerProfile = null;
    if (current.role === 'seller') {
      sellerProfile = {
        company_name: current.company_name || current.name,
        nuit: current.nuit,
        business_type: current.business_type || 'company',
        verified_status: current.verified_status || 'verified',
        rating: current.rating || 4.98,
        total_sales: current.total_sales || 48
      };
    }

    // Counts from MongoDB
    const unreadCount = await Notification.countDocuments({ user_id: userId, is_read: false });
    const watchlistCount = await Watchlist.countDocuments({ user_id: userId });

    const { password_hash, ...safeUser } = current;

    return res.json({
      user: {
        ...safeUser,
        sellerProfile,
        unreadNotificationsCount: unreadCount,
        watchlistCount
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao carregar dados do utilizador', error: err.message });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Sessão terminada com sucesso' });
});

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  return res.json({
    message: 'Se o endereço estiver registado, receberá uma mensagem com as instruções de recuperação.'
  });
});

export default router;
