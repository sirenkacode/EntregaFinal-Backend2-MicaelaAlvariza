import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { COOKIE_NAME, JWT_SECRET, RESET_PASSWORD_SECRET, APP_URL } from '../config/config.js';
import UserDTO from '../dto/user.dto.js';
import { createHash, isValidPassword } from '../utils/bcryptUtil.js';
import { sendMail } from '../utils/mailer.js';
import UsersDAO from '../dao/mongo/users.dao.js';
import UserRepository from '../repositories/user.repository.js';

const router = Router();
const userRepo = new UserRepository(new UsersDAO());

const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// POST /api/sessions/register
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
  const token = generateToken(req.user);
  res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax' });
  return res.status(201).json({ status: 'success', token });
});

// POST /api/sessions/login
router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
  const token = generateToken(req.user);
  res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ status: 'success', token });
});

// GET /api/sessions/current  (DTO, no sensitive info)
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  const dto = new UserDTO(req.user);
  return res.json({ status: 'success', user: dto });
});

/**
 * PASSWORD RECOVERY
 * POST /api/sessions/forgot-password  { email }
 * - sends email with link that expires in 1 hour
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email requerido' });

    const user = await userRepo.findByEmail(email);
    // Don't reveal if user exists
    if (!user) return res.json({ status: 'success', message: 'Si el email existe, se envió un correo con instrucciones' });

    const resetToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      RESET_PASSWORD_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `${APP_URL}/api/sessions/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4">
        <h2>Restablecer contraseña</h2>
        <p>Recibimos una solicitud para cambiar tu contraseña.</p>
        <p>Este enlace expira en 1 hora.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no fuiste vos, podés ignorar este correo.</p>
      </div>
    `;

    await sendMail({ to: user.email, subject: 'Restablecer contraseña', html });

    return res.json({ status: 'success', message: 'Si el email existe, se envió un correo con instrucciones' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/sessions/reset-password/:token
 * - validates token and shows simple message (API-friendly)
 * You can replace this with a handlebars view if you want.
 */
router.get('/reset-password/:token', async (req, res) => {
  try {
    jwt.verify(req.params.token, RESET_PASSWORD_SECRET);
    return res.json({ status: 'success', message: 'Token válido. Usar POST /api/sessions/reset-password para cambiar contraseña.' });
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
  }
});

/**
 * POST /api/sessions/reset-password  { token, password }
 * - token must be valid and not expired
 * - new password must be different to the previous one
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ status: 'error', message: 'Token y password requeridos' });

    const payload = jwt.verify(token, RESET_PASSWORD_SECRET);
    const user = await userRepo.findById(payload.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    // Prevent same password
    const same = isValidPassword(user, password);
    if (same) {
      return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const hashed = createHash(password);
    await userRepo.updatePasswordById(user._id, hashed);

    return res.json({ status: 'success', message: 'Contraseña actualizada' });
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return res.status(400).json({ status: 'error', message: msg });
  }
});

export default router;
