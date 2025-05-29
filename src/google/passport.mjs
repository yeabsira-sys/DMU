import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GoogleUser } from '../models/googleUser.mjs';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3500/googleAuth/callback'
}, async (accessToken, refreshToken, profile, done) => {

  try {
    let user = await GoogleUser.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await GoogleUser.create({
        email: profile.emails[0].value,
        accessToken,
        refreshToken
      });
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();
    }

    return done(null, { id: user._id, email: user.email }); // Only saving ID/email in session
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (obj, done) => {
  try {
    const user = await GoogleUser.findById(obj.id);
    done(null, user); // user now has accessToken and refreshToken
  } catch (err) {
    done(err);
  }
});
