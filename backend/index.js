// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
// import other routes later: menuRoutes, orderRoutes, etc.

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes); // login => POST /api/login

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
