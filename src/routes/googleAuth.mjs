import express from 'express';
import passport from 'passport';
const router = express.Router();

/**
 * @swagger
 * /googleAuth/google:
 *   get:
 *     tags:
 *       - Google Auth
 *     summary: Initiates Google OAuth login
 *     description: Redirects the user to Google's OAuth 2.0 server for authentication and consent.
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get('/google', passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar'
  ]
}));

/**
 * @swagger
 * /googleAuth/callback:
 *   get:
 *     tags:
 *       - Google Auth
 *     summary: Handles Google OAuth callback
 *     description: This route handles the callback from Google after user authentication.
 *     responses:
 *       302:
 *         description: Redirect to dashboard on success, or root on failure
 */
router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('http://localhost:3500/api-docs/google');
});

/**
 * @swagger
 * /googleAuth/logout:
 *   get:
 *     tags:
 *       - Google Auth
 *     summary: Logs out the user
 *     description: Ends the user's session and redirects them to the homepage.
 *     responses:
 *       302:
 *         description: Redirect to root after logout
 */
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

export default router;
