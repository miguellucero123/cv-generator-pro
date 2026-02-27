const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { optionalAuth } = require('../middleware/auth');
const { publicApiLimiter } = require('../middleware/rateLimiter');

router.get('/:publicUrl', publicApiLimiter, optionalAuth, shareController.getPublicCV);
router.post('/:publicUrl/verify', publicApiLimiter, shareController.verifyPassword);
router.get('/:publicUrl/download', publicApiLimiter, shareController.downloadPublicCV);

module.exports = router;
