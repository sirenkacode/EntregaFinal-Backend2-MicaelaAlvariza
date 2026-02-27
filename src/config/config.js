import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/entrega-final';

export const JWT_SECRET = process.env.JWT_SECRET || 'superSecretJWTChangeMe';
export const COOKIE_NAME = process.env.COOKIE_NAME || 'authToken';

export const PORT = process.env.PORT || 8080;

// Base URL where your server is running (used to build links in emails)
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Password reset
export const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || 'resetSecretChangeMe';

// SMTP (Nodemailer)
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'no-reply@example.com';
