const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');

router.post('/register', authLimiter, validateRegister, handleValidationErrors, authController.register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, authController.resetPassword);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.changePassword);
router.post('/logout', protect, authController.logout);

if (process.env.GOOGLE_CLIENT_ID) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed` }),
    (req, res) => {
      const token = req.user.generateAuthToken();
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    }
  );
}

if (process.env.LINKEDIN_CLIENT_ID) {
  router.get('/linkedin', passport.authenticate('linkedin'));
  router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=linkedin_auth_failed` }),
    (req, res) => {
      const token = req.user.generateAuthToken();
      const linkedInToken = req.user._linkedInAccessToken;
      const base = process.env.FRONTEND_URL || 'http://localhost:5173';
      const url = linkedInToken ? `${base}/auth/callback?token=${token}&linkedin_import=true` : `${base}/auth/callback?token=${token}`;
      res.redirect(url);
    }
  );
}

module.exports = router;
