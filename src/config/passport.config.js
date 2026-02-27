import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { userModel } from '../dao/models/userModel.js';
import { cartModel } from '../dao/models/cartModel.js';
import { createHash, isValidPassword } from '../utils/bcryptUtil.js';
import { COOKIE_NAME, JWT_SECRET } from './config.js';

// Extractor: cookie authToken OR Authorization: Bearer <token>
const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies[COOKIE_NAME];
  return null;
};

export const initializePassport = () => {
  // REGISTER
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          if (!first_name || !last_name || !age || !email || !password) {
            return done(null, false, { message: 'Faltan campos requeridos' });
          }

          const exists = await userModel.findOne({ email });
          if (exists) return done(null, false, { message: 'El usuario ya existe' });

          const cart = await cartModel.create({ products: [] });
          const user = await userModel.create({
            first_name,
            last_name,
            email,
            age: Number(age),
            password: createHash(password),
            cart: cart._id,
            role: 'user',
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Password incorrecta' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // CURRENT (JWT)
  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          // jwtPayload: { id, ... }
          const user = await userModel.findById(jwtPayload.id).lean();
          if (!user) return done(null, false, { message: 'Token válido, pero usuario no existe' });

          // never expose password
          const { password, ...safeUser } = user;
          return done(null, safeUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default passport;
