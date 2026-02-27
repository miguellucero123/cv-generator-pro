const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, requirePlan } = require('../middleware/auth');
const { validateObjectId, handleValidationErrors } = require('../middleware/validation');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/cv/:id', validateObjectId('id'), handleValidationErrors, analyticsController.getCVAnalytics);
router.get('/cv/:id/detailed', validateObjectId('id'), handleValidationErrors, requirePlan('pro', 'enterprise'), analyticsController.getDetailedAnalytics);
router.get('/export', requirePlan('pro', 'enterprise'), analyticsController.exportAnalytics);

module.exports = router;
