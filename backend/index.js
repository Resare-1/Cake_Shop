// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
import menuRouter from './routes/menus.js';
import orderRouter from './routes/orders.js';
import ingredientsRouter from './routes/ingredients.js';
// import other routes later: menuRoutes, orderRoutes, etc.

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes); // login => POST /api/login
app.use('/api/menus', menuRouter); // GET /api/menu
app.use('/api/orders', orderRouter);//
app.use('/api/ingredients', ingredientsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});