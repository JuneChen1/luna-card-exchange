const express = require('express');
const isAuth = require('../middlewares/isAuth');
const myCardController = require('../controllers/myCards');
const router = express.Router();

router.use(isAuth);

router.get('/uids', myCardController.getUidSummary);
router.get('/', myCardController.getMyCards);
router.post('/', myCardController.updateCards);
router.patch('/visibility', myCardController.updateVisibility);
router.delete('/', myCardController.deleteUidCards);

module.exports = router;
