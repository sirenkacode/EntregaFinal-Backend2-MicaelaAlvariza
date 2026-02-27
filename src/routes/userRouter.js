import { Router } from 'express';
import { userDBManager } from '../dao/userDBManager.js';

const router = Router();
const users = new userDBManager();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const all = await users.getAllUsers();
    // do not expose passwords
    const safe = all.map(({ password, ...u }) => u);
    return res.json({ status: 'success', payload: safe });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

// GET /api/users/:uid
router.get('/:uid', async (req, res) => {
  try {
    const user = await users.getUserById(req.params.uid);
    const { password, ...safe } = user;
    return res.json({ status: 'success', payload: safe });
  } catch (err) {
    return res.status(404).json({ status: 'error', error: err.message });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const created = await users.createUser(req.body);
    const obj = created.toObject();
    const { password, ...safe } = obj;
    return res.status(201).json({ status: 'success', payload: safe });
  } catch (err) {
    return res.status(400).json({ status: 'error', error: err.message });
  }
});

// PUT /api/users/:uid
router.put('/:uid', async (req, res) => {
  try {
    const result = await users.updateUser(req.params.uid, req.body);
    return res.json({ status: 'success', payload: result });
  } catch (err) {
    return res.status(400).json({ status: 'error', error: err.message });
  }
});

// DELETE /api/users/:uid
router.delete('/:uid', async (req, res) => {
  try {
    const result = await users.deleteUser(req.params.uid);
    return res.json({ status: 'success', payload: result });
  } catch (err) {
    return res.status(404).json({ status: 'error', error: err.message });
  }
});

export default router;
