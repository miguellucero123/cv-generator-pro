const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { provider: 'google', providerId: profile.id },
            { email: profile.emails?.[0]?.value }
          ]
        });

        if (user) {
          if (user.provider !== 'google') {
            user.providerId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
          }
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          email: profile.emails?.[0]?.value || `${profile.id}@oauth.local`,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          provider: 'google',
          providerId: profile.id,
          isVerified: true,
          lastLogin: new Date()
        });
        done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  ));
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || profile._json?.email;
        let user = await User.findOne({
          $or: [
            { provider: 'linkedin', providerId: profile.id },
            { email }
          ]
        });

        if (user) {
          if (user.provider !== 'linkedin') {
            user.providerId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
          }
          user.lastLogin = new Date();
          await user.save();
          user._linkedInAccessToken = accessToken;
          return done(null, user);
        }

        user = await User.create({
          email: email || `${profile.id}@linkedin.local`,
          name: profile.displayName || profile._json?.formattedName,
          avatar: profile.photos?.[0]?.value,
          provider: 'linkedin',
          providerId: profile.id,
          isVerified: true,
          lastLogin: new Date()
        });
        user._linkedInAccessToken = accessToken;
        done(null, user);
      } catch (error) {
        console.error('LinkedIn OAuth error:', error);
        done(error, null);
      }
    }
  ));
}

module.exports = passport;
