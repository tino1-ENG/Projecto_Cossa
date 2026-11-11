import express from 'express';
import { Category, Product, Auction } from '../models/index.js';

const router = express.Router();

// GET /api/v1/categories — List all categories with active auction count
router.get('/', async (req, res) => {
  try {
    const mongoCategories = await Category.find({ is_active: true }).sort({ display_order: 1 }).lean();
    const result = await Promise.all(mongoCategories.map(async (cat) => {
      const prodIds = (await Product.find({ category_id: cat.id }).select('id').lean()).map(p => p.id);
      const count = await Auction.countDocuments({ product_id: { $in: prodIds }, status: 'active' });
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        featured: cat.is_featured || false,
        active_auctions_count: count
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ message: 'Erro ao carregar categorias', error: err.message });
  }
});

export default router;
