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

      if (username !== undefined) return next(appError('USERNAME_IMMUTABLE'));

      if (email !== undefined && email !== '' && !isValidEmail(email))
        return next(appError('INVALID_FIELDS'));

      if (
        contact_info !== undefined &&
        contact_info !== '' &&
        (!isValidString(contact_info) || contact_info.trim().length > 255)
      )
        return next(appError('INVALID_FIELDS'));

      if (email === undefined && contact_info === undefined)
        return next(appError('NOTHING_TO_UPDATE'));

      const userRepo = dataSource.getRepository('Users');
      const updateData = {};
      if (email !== undefined) {
        if (email !== '') {
          const existing = await userRepo.findOneBy({
            email: email.trim().toLowerCase(),
            id: Not(req.user.id)
          });
          if (existing) return next(appError('EMAIL_TAKEN'));
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
        return next(appError('INVALID_FIELDS'));

      if (new_password !== confirm_password)
        return next(appError('NEW_PASSWORD_MISMATCH'));

      const isMatch = await bcrypt.compare(old_password, req.user.password);
      if (!isMatch) return next(appError('OLD_PASSWORD_WRONG'));

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
        return next(appError('CANNOT_DELETE_ADMIN'));

      const { password } = req.body || {};

      if (!isValidPassword(password)) return next(appError('INVALID_FIELDS'));

      const isMatch = await bcrypt.compare(password, req.user.password);
      if (!isMatch) return next(appError('PASSWORD_WRONG'));

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
