import express from 'express';
import { Category, Product, Auction } from '../models/index.js';
import { queryAll } from '../database/db.js';

const router = express.Router();

// GET /api/v1/categories — List all categories with auction count
router.get('/', async (req, res) => {
  try {
    // Query MongoDB first
    const mongoCategories = await Category.find({ is_active: true }).sort({ display_order: 1 }).lean();
    if (mongoCategories && mongoCategories.length > 0) {
      const result = await Promise.all(mongoCategories.map(async (cat) => {
        const prodIds = (await Product.find({ category_id: cat.id }).select('id').lean()).map(p => p.id);
        const count = await Auction.countDocuments({ product_id: { $in: prodIds }, status: 'active' });
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description,
          active_auctions_count: count
        };
      }));
      return res.json(result);
    }

    // Fallback to SQLite
    const categories = queryAll(`
      SELECT 
        c.id, c.name, c.slug, c.icon, c.description, c.featured,
        COUNT(DISTINCT a.id) as active_auctions_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN auctions a ON p.id = a.product_id AND a.status = 'active'
      GROUP BY c.id
      ORDER BY c.featured DESC, c.name ASC
    `);

    return res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ message: 'Erro ao carregar categorias', error: err.message });
  }
});

export default router;
