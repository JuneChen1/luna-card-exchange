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
  const errors = require('./config/errors');
  const errorBody = require('./utils/errorBody');

  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        callback(null, !origin || allowedOrigins.includes(origin));
      }
    })
  );
  app.use(express.json());
  
  app.use((req, res, next) => {
    req.body ??= {};
    next();
  });
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
    res
      .status(errors.ROUTE_NOT_FOUND.status)
      .json(errorBody('ROUTE_NOT_FOUND'));
  });

  app.use((err, req, res, next) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        code: err.errorCode,
        message: err.message
      });
    }

    if (err.type === 'entity.parse.failed') {
      return res
        .status(errors.INVALID_FIELDS.status)
        .json(errorBody('INVALID_FIELDS'));
    }

    if (err.type === 'entity.too.large') {
      return res
        .status(errors.PAYLOAD_TOO_LARGE.status)
        .json(errorBody('PAYLOAD_TOO_LARGE'));
    }

    console.error(err);
    res
      .status(errors.SERVER_ERROR.status)
      .json(errorBody('SERVER_ERROR', 'failed'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`伺服器啟動中：http://localhost:${PORT}`));
}

main();
