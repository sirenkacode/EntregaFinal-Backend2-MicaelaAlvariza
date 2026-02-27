import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import userRouter from './routes/userRouter.js';
import sessionRouter from './routes/sessionRouter.js';

import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import { initializePassport } from './config/passport.config.js';
import { MONGO_URI, PORT } from './config/config.js';

const app = express();

// DB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Passport
initializePassport();
app.use(passport.initialize());

// Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);
websocket(io);
