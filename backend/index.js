import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import reportRouter from './routes/report.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/menus', menuRouter);
app.use('/api/report', reportRouter);

app.listen(process.env.PORT, () =>
  console.log(`✅ Backend running on port ${process.env.PORT}`)
);
