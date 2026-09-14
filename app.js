require('dotenv').config();

const { dataSource } = require('./db/data-source');

async function main() {
  try {
    await dataSource.initialize();
    console.log('資料庫連線成功');
  } catch (error) {
    console.error('資料庫連線失敗：', error);
    process.exit(1);
  }

  const express = require('express');
  const cors = require('cors');
  const healthRouter = require('./routes/health');
  const authRouter = require('./routes/auth');
  const cardRouter = require('./routes/cards');
  const userRouter = require('./routes/users');
  const myCardRouter = require('./routes/myCards');
  const exchangeRouter = require('./routes/exchange');
  const adminRouter = require('./routes/admin');
  const { globalLimiter } = require('./middlewares/limiter');

  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin))
          return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      }
    })
  );
  app.use(express.json());
  app.use(express.static('public'));
  app.use(globalLimiter);

  app.use('/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/cards', cardRouter);
  app.use('/api/users', userRouter);
  app.use('/api/my-cards', myCardRouter);
  app.use('/api/exchange', exchangeRouter);
  app.use('/api/admin', adminRouter);

  app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Page Not Found' });
  });

  app.use((err, req, res, next) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    }

    console.error(err);
    res.status(500).json({
      status: 'failed',
      message: '伺服器發生錯誤，請稍後再試'
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`伺服器啟動中：http://localhost:${PORT}`));
}

main();
