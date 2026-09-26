const { getUidStartByServer, parseCardIds } = require('../utils/genshinUtils');
const { isValidCardsList } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { dataSource } = require('../db/data-source');

const cardController = {
  async getMatch(req, res, next) {
    const { wanted: wantedRaw, offered: offeredRaw, server } = req.query;

    if (
      (wantedRaw && typeof wantedRaw !== 'string') ||
      (offeredRaw && typeof offeredRaw !== 'string') ||
      (server && typeof server !== 'string')
    )
      return next(appError(400, '欄位未填寫正確'));

    const wanted = parseCardIds(wantedRaw);
    const offered = parseCardIds(offeredRaw);
    const uidStarts = server ? getUidStartByServer(server) : null;

    if (
      (wantedRaw && !isValidCardsList(wanted)) ||
      (offeredRaw && !isValidCardsList(offered)) ||
      (server && !uidStarts)
    )
      return next(appError(400, '欄位未填寫正確'));

    try {
      const params = [];
      const matchConditions = [];

      if (wanted.length > 0) {
        params.push(wanted);
        matchConditions.push(
          `(uc.status = 'offered' AND uc.card_id = ANY($${params.length}::int[]))`
        );
      }
      if (offered.length > 0) {
        params.push(offered);
        matchConditions.push(
          `(uc.status = 'wanted' AND uc.card_id = ANY($${params.length}::int[]))`
        );
      }

      let sql = `
        SELECT uc.*, u.contact_info, u.name AS user_name
        FROM user_cards uc
        JOIN users u ON u.id = uc.user_id
      `;

      const whereClauses = ['uc.is_public = true'];
      if (matchConditions.length > 0)
        whereClauses.push(`(${matchConditions.join(' OR ')})`);

      if (uidStarts) {
        params.push(uidStarts.map((prefix) => `${prefix}%`));
        whereClauses.push(`uc.genshin_uid LIKE ANY($${params.length}::text[])`);
      }

      sql += ` WHERE ${whereClauses.join(' AND ')}`;

      sql += ' ORDER BY uc.created_at DESC';

      const findData = await dataSource.query(sql, params);

      const groupe = {};
      findData.forEach((item) => {
        const key = `${item.user_name}_${item.genshin_uid}`;
        if (!groupe[key]) {
          groupe[key] = {
            user_id: item.user_id,
            user_name: item.user_name,
            genshin_uid: item.genshin_uid,
            offered_card_ids: [],
            wanted_card_ids: [],
            contact_info: item.contact_info ? item.contact_info : null
          };
        }

        if (item.status === 'offered') {
          groupe[key].offered_card_ids.push(item.card_id);
        } else if (item.status === 'wanted') {
          groupe[key].wanted_card_ids.push(item.card_id);
        }
      });

      let data;
      if (wanted.length > 0 && offered.length > 0) {
        data = Object.values(groupe).filter(
          (g) => g.offered_card_ids.length > 0 && g.wanted_card_ids.length > 0
        );
      } else {
        data = Object.values(groupe);
      }

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cardController;
