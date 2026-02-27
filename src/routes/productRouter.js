import { Router } from 'express';
import { uploader } from '../utils/multerUtil.js';
import ProductService from '../services/product.service.js';
import { requireAuth, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();
const productService = new ProductService();

// GET /api/products
router.get('/', async (req, res) => {
  const result = await productService.getAll(req.query);
  res.send({ status: 'success', payload: result });
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const result = await productService.getById(req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// POST /api/products (ADMIN ONLY)
router.post(
  '/',
  requireAuth,
  authorizeRoles('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((f) => f.path);
    }

    try {
      const result = await productService.create(req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

// PUT /api/products/:pid (ADMIN ONLY)
router.put(
  '/:pid',
  requireAuth,
  authorizeRoles('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((f) => f.filename);
    }

    try {
      const result = await productService.update(req.params.pid, req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

// DELETE /api/products/:pid (ADMIN ONLY)
router.delete('/:pid', requireAuth, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await productService.delete(req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

export default router;
