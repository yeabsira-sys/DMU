import express from 'express';
import passport from 'passport';
const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/calendar']
}));

router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/dashboard'
}), (req, res) => {
  res.redirect('http://localhost:5173/dashboard');
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

export default router
