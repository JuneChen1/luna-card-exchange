const { ILike } = require('typeorm');
const {
  isValidString,
  isPositiveInteger,
  isValidUUID,
  isValidGenshinUid
} = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');

const adminController = {
  async getUsers(req, res, next) {
    try {
      const { keyword, banned, page, limit } = req.query;

      if (keyword !== undefined && typeof keyword !== 'string')
        return next(appError('INVALID_FIELDS'));

      if (banned !== undefined && banned !== 'true' && banned !== 'false')
        return next(appError('INVALID_FIELDS'));

      const pageNum = page !== undefined ? Number(page) : 1;
      const limitNum = limit !== undefined ? Number(limit) : 20;
      if (
        !isPositiveInteger(pageNum) ||
        !isPositiveInteger(limitNum) ||
        limitNum > 100
      )
        return next(appError('INVALID_FIELDS'));

      const userRepo = dataSource.getRepository('Users');
      const where = {};
      if (keyword !== undefined && isValidString(keyword))
        where.name = ILike(`%${keyword.trim()}%`);
      if (banned !== undefined) where.is_banned = banned === 'true';

      const [users, total] = await userRepo.findAndCount({
        where,
        order: { name: 'ASC' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      });

      res.status(200).json({
        status: 'success',
        data: {
          users: users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            contact_info: user.contact_info,
            role: user.role,
            is_banned: user.is_banned,
            created_at: user.created_at
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            total_pages: Math.ceil(total / limitNum)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async banUser(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return next(appError('INVALID_FIELDS'));

      if (id === req.user.id) return next(appError('CANNOT_BAN_SELF'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({ id });
      if (!user) return next(appError('USER_NOT_FOUND'));
      if (user.role === 'ADMIN') return next(appError('CANNOT_BAN_ADMIN'));

      await userRepo.update(user.id, { is_banned: true });

      res.status(200).json({
        status: 'success',
        data: {
          user: { id: user.id, name: user.name, is_banned: true }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async unbanUser(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return next(appError('INVALID_FIELDS'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({ id });
      if (!user) return next(appError('USER_NOT_FOUND'));

      await userRepo.update(user.id, { is_banned: false });

      res.status(200).json({
        status: 'success',
        data: {
          user: { id: user.id, name: user.name, is_banned: false }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async promoteUser(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return next(appError('INVALID_FIELDS'));

      const userRepo = dataSource.getRepository('Users');
      const user = await userRepo.findOneBy({ id });
      if (!user) return next(appError('USER_NOT_FOUND'));

      if (user.role === 'ADMIN') return next(appError('ALREADY_ADMIN'));

      await userRepo.update(user.id, { role: 'ADMIN' });

      res.status(200).json({
        status: 'success',
        data: {
          user: { id: user.id, name: user.name, role: 'ADMIN' }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async forceDeleteUidCards(req, res, next) {
    try {
      const { id } = req.params;
      const genshinUid =
        typeof req.params.genshinUid === 'string'
          ? req.params.genshinUid.trim()
          : req.params.genshinUid;
      if (!isValidUUID(id) || !isValidGenshinUid(genshinUid))
        return next(appError('INVALID_FIELDS'));

      const linkRepo = dataSource.getRepository('UserCards');
      const deleteData = await linkRepo.find({
        where: { genshin_uid: genshinUid, user: { id } }
      });

      if (deleteData.length === 0)
        return next(appError('NO_DATA', { status: 404 }));

      await linkRepo.remove(deleteData);

      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
