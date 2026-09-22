const bcrypt = require('bcrypt');
const {
  isValidString,
  isValidEmail,
  isValidPassword
} = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');
const { Not } = require('typeorm');

const userController = {
  getMe(req, res, next) {
    try {
      const { id, name, contact_info, email } = req.user;

      res.status(200).json({
        status: 'success',
        data: {
          user: { id, name, contact_info, email }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req, res, next) {
    try {
      const { username, email, contact_info } = req.body || {};

      if (username !== undefined) return next(appError(400, '帳號不可修改'));

      if (email !== undefined && email !== '' && !isValidEmail(email))
        return next(appError(400, '欄位未填寫正確'));

      if (
        contact_info !== undefined &&
        contact_info !== '' &&
        (!isValidString(contact_info) || contact_info.trim().length > 255)
      )
        return next(appError(400, '欄位未填寫正確'));

      if (email === undefined && contact_info === undefined)
        return next(appError(400, '沒有可更新的欄位'));

      const userRepo = dataSource.getRepository('Users');
      const updateData = {};
      if (email !== undefined) {
        if (email !== '') {
          const existing = await userRepo.findOneBy({
            email: email.trim().toLowerCase(),
            id: Not(req.user.id)
          });
          if (existing) return next(appError(400, 'email 已被使用'));
        }

        updateData.email = email.trim().toLowerCase() || null;
      }
      if (contact_info !== undefined)
        updateData.contact_info = contact_info.trim() || null;

      const user = await userRepo.save({
        ...req.user,
        ...updateData
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            contact_info: user.contact_info,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { old_password, new_password, confirm_password } = req.body || {};

      if (
        !isValidPassword(old_password) ||
        !isValidPassword(new_password) ||
        !isValidPassword(confirm_password)
      )
        return next(appError(400, '欄位未填寫正確'));

      if (new_password !== confirm_password)
        return next(appError(400, '兩次輸入的新密碼不一致'));

      const isMatch = await bcrypt.compare(old_password, req.user.password);
      if (!isMatch) return next(appError(400, '舊密碼錯誤'));

      const hashedPassword = await bcrypt.hash(new_password, 10);
      const userRepo = dataSource.getRepository('Users');
      await userRepo.save({ ...req.user, password: hashedPassword });

      res.status(200).json({
        status: 'success',
        message: '密碼更新成功'
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteMe(req, res, next) {
    try {
      if (req.user.role === 'ADMIN')
        return next(appError(403, '不可刪除管理者帳號'));

      const { password } = req.body || {};

      if (!isValidPassword(password))
        return next(appError(400, '欄位未填寫正確'));

      const isMatch = await bcrypt.compare(password, req.user.password);
      if (!isMatch) return next(appError(400, '密碼錯誤'));

      const userId = req.user.id;

      await dataSource.transaction(async (manager) => {
        await manager
          .getRepository('UserCards')
          .delete({ user: { id: userId } });
        await manager.getRepository('Users').delete({ id: userId });
      });

      res.status(200).json({
        status: 'success',
        message: '帳號已刪除'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
