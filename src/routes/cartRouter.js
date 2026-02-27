import { Router } from 'express';
import CartService from '../services/cart.service.js';
import { requireAuth, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();
const cartService = new CartService();

const ensureOwnCart = (req, res, next) => {
  // For users, only allow operating on their own cart.
  if (req.user?.role === 'user') {
    const userCartId = req.user.cart?.toString?.() || req.user.cart;
    if (userCartId && userCartId !== req.params.cid) {
      return res.status(403).json({ status: 'error', message: 'No puedes operar sobre el carrito de otro usuario' });
    }
  }
  next();
};

// GET /api/carts/:cid
router.get('/:cid', requireAuth, ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.getById(req.params.cid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// POST /api/carts (create cart)
router.post('/', requireAuth, async (req, res) => {
  try {
    const result = await cartService.create();
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// POST /api/carts/:cid/product/:pid (USER ONLY)
router.post('/:cid/product/:pid', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.addProduct(req.params.cid, req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid/product/:pid (USER ONLY)
router.delete('/:cid/product/:pid', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.removeProduct(req.params.cid, req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid (USER ONLY)
router.put('/:cid', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.updateAll(req.params.cid, req.body.products);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid/product/:pid (USER ONLY)
router.put('/:cid/product/:pid', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.updateQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid (USER ONLY)
router.delete('/:cid', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.clear(req.params.cid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// POST /api/carts/:cid/purchase (USER ONLY)
router.post('/:cid/purchase', requireAuth, authorizeRoles('user'), ensureOwnCart, async (req, res) => {
  try {
    const result = await cartService.purchase(req.params.cid, req.user.email);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

export default router;
