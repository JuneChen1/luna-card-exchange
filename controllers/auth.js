const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  isValidString,
  isValidUsername,
  isValidPassword,
  isValidEmail
} = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');
const { sendResetPasswordEmail } = require('../utils/mailer');

function getResetPasswordSecret() {
  return (
    process.env.RESET_PASSWORD_SECRET ||
    crypto
      .createHash('sha256')
      .update(`${process.env.JWT_SECRET}:reset-password`)
      .digest('hex')
  );
}

const authController = {
  async register(req, res, next) {
    try {
      const { username, password, confirm_password } = req.body;
      if (
        !isValidUsername(username) ||
        !isValidPassword(password) ||
        !isValidPassword(confirm_password)
      )
        return next(appError(400, '欄位未填寫正確'));

      if (password !== confirm_password)
        return next(appError(400, '兩次輸入的密碼不一致'));

      const userRepo = dataSource.getRepository('Users');
      const existing = await userRepo.findOneBy({
        name: username.trim()
      });
      if (existing) return next(appError(409, '名字已被使用'));

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepo.save({
        name: username.trim(),
        password: hashedPassword,
        role: 'USER'
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name
          }
        }
      });
    } catch (error) {
      if (error.code === '23505') return next(appError(409, '名字已被使用'));
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!isValidString(username) || !isValidString(password))
        return next(appError(400, '欄位未填寫正確'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({
        name: username.trim()
      });
      if (!user) return next(appError(400, '使用者不存在或密碼輸入錯誤'));
      if (user.is_banned === true)
        return next(appError(403, '您的帳號已被停權，如有疑問請聯絡管理者'));

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return next(appError(400, '使用者不存在或密碼輸入錯誤'));

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_DAY }
      );

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            name: user.name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  logout(req, res) {
    res.status(200).json({
      status: 'success',
      message: '登出成功'
    });
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!isValidEmail(email)) return next(appError(400, '欄位未填寫正確'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({
        email: email.trim().toLowerCase()
      });

      if (user) {
        const resetToken = jwt.sign(
          { id: user.id, purpose: 'reset-password' },
          getResetPasswordSecret(),
          { expiresIn: process.env.RESET_PASSWORD_EXPIRES || '15m' }
        );
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

        try {
          await sendResetPasswordEmail(user.email, resetUrl);
        } catch (mailError) {
          console.error('寄送重設密碼信件失敗：', mailError);
        }
      }

      res.status(200).json({
        status: 'success',
        message: '若此 Email 已註冊，重設密碼信件已發送至您的信箱，請前往收信。'
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, new_password, confirm_password } = req.body;

      if (
        !isValidString(token) ||
        !isValidPassword(new_password) ||
        !isValidPassword(confirm_password)
      )
        return next(appError(400, '欄位未填寫正確'));

      if (new_password !== confirm_password)
        return next(appError(400, '兩次輸入的新密碼不一致'));

      let decoded;
      try {
        decoded = jwt.verify(token, getResetPasswordSecret());
      } catch (error) {
        return next(appError(400, '重設連結無效或已過期'));
      }

      if (decoded.purpose !== 'reset-password')
        return next(appError(400, '重設連結無效或已過期'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({ id: decoded.id });
      if (!user) return next(appError(400, '重設連結無效或已過期'));

      const updatedAtSeconds = Math.floor(
        new Date(user.updated_at).getTime() / 1000
      );
      if (decoded.iat <= updatedAtSeconds)
        return next(appError(400, '重設連結無效或已過期'));

      const hashedPassword = await bcrypt.hash(new_password, 10);
      await userRepo.save({ ...user, password: hashedPassword });

      res.status(200).json({
        status: 'success',
        message: '密碼重設成功，請重新登入'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
