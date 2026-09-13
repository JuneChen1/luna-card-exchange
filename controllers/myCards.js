const { isValidGenshinUid, isValidCardsList } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');

const myCardController = {
  async getUidSummary(req, res, next) {
    try {
      const linkRepo = dataSource.getRepository('UserCards');
      const result = await linkRepo.find({
        where: { user: { id: req.user.id } },
        relations: { card: true },
        order: { genshin_uid: 'ASC' }
      });

      const summaryByUid = {};
      result.forEach((item) => {
        if (!summaryByUid[item.genshin_uid])
          summaryByUid[item.genshin_uid] = {
            genshin_uid: item.genshin_uid,
            offered: [],
            wanted: []
          };

        summaryByUid[item.genshin_uid][item.status].push(item.card.id);
      });

      res.status(200).json({
        status: 'success',
        data: Object.values(summaryByUid)
      });
    } catch (error) {
      next(error);
    }
  },
  async getMyCards(req, res, next) {
    const uid =
      typeof req.query.uid === 'string' ? req.query.uid.trim() : req.query.uid;
    if (!isValidGenshinUid(uid))
      return next(appError(400, '原神 UID 格式錯誤'));
    try {
      const linkRepo = dataSource.getRepository('UserCards');
      const result = await linkRepo.find({
        where: { genshin_uid: uid, user: { id: req.user.id } },
        relations: { card: true }
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  async updateCards(req, res, next) {
    const { offered, wanted } = req.body;
    const genshinUid =
      typeof req.body.genshinUid === 'string'
        ? req.body.genshinUid.trim()
        : req.body.genshinUid;
    if (
      !isValidGenshinUid(genshinUid) ||
      !isValidCardsList(offered) ||
      !isValidCardsList(wanted)
    )
      return next(appError(400, '欄位未填寫正確'));

    if (offered.length === 0 && wanted.length === 0)
      return next(appError(400, '沒有可更新的欄位'));

    const overlap = offered.filter((cardId) => wanted.includes(cardId));
    if (overlap.length > 0)
      return next(appError(400, '同一張卡片不能同時是提供與需求'));

    try {
      const result = await dataSource.transaction(async (manager) => {
        const linkRepo = manager.getRepository('UserCards');
        const deleteData = await linkRepo.find({
          where: { genshin_uid: genshinUid, user: { id: req.user.id } }
        });
        await linkRepo.remove(deleteData);

        const newData = [];
        offered.forEach((cardId) =>
          newData.push({
            genshin_uid: genshinUid,
            status: 'offered',
            user: { id: req.user.id },
            card: { id: cardId }
          })
        );
        wanted.forEach((cardId) =>
          newData.push({
            genshin_uid: genshinUid,
            status: 'wanted',
            user: { id: req.user.id },
            card: { id: cardId }
          })
        );

        return linkRepo.save(newData);
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteUidCards(req, res, next) {
    const uid =
      typeof req.query.uid === 'string' ? req.query.uid.trim() : req.query.uid;
    if (!isValidGenshinUid(uid))
      return next(appError(400, '原神 UID 格式錯誤'));

    try {
      const linkRepo = dataSource.getRepository('UserCards');
      const deleteData = await linkRepo.find({
        where: { genshin_uid: uid, user: { id: req.user.id } }
      });

      if (deleteData.length === 0) return next(appError(400, '查無資料'));

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

module.exports = myCardController;
