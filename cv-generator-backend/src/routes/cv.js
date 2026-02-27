const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const shareController = require('../controllers/shareController');
const { protect, checkUsageLimit } = require('../middleware/auth');
const { createLimiter, exportLimiter } = require('../middleware/rateLimiter');
const { validateCV, validateObjectId, validateShare, handleValidationErrors } = require('../middleware/validation');

router.use(protect);

router.route('/')
  .get(cvController.getCVs)
  .post(createLimiter, checkUsageLimit('cvs'), validateCV, handleValidationErrors, cvController.createCV);

router.route('/:id')
  .get(validateObjectId('id'), handleValidationErrors, cvController.getCV)
  .put(validateObjectId('id'), validateCV, handleValidationErrors, cvController.updateCV)
  .delete(validateObjectId('id'), handleValidationErrors, cvController.deleteCV);

router.post('/:id/clone', validateObjectId('id'), handleValidationErrors, checkUsageLimit('cvs'), cvController.cloneCV);
router.get('/:id/export', exportLimiter, validateObjectId('id'), handleValidationErrors, cvController.exportCV);
router.post('/import', createLimiter, checkUsageLimit('cvs'), cvController.importCV);

router.route('/:id/share')
  .get(validateObjectId('id'), handleValidationErrors, shareController.getShareSettings)
  .put(validateObjectId('id'), validateShare, handleValidationErrors, shareController.updateShareSettings);

router.post('/:id/share/regenerate-url', validateObjectId('id'), handleValidationErrors, shareController.regeneratePublicUrl);

module.exports = router;
