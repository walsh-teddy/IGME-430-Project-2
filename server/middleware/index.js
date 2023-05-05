// Rerout the user to the login screen if they havent logged in yet
const requireLogin = (req, res, next) => {
  // Check if there is an account attatched to their session (they are logged in)
  if (!req.session.account) { // They haven't logged in
    return res.redirect('/');
  }
  // If they did log in, then do the next middleware function
  return next();
};

// Rerout the user to the app screen if they have logged in but not out
const requireLogout = (req, res, next) => {
  // Check if there is an account attached to their session (they are logged in)
  if (req.session.account) { // They are logged in
    return res.redirect('/maker');
  }
  // If they logged out, then do the next middleware function
  return next();
};

// Rerout the user to https if they arent using it
const requireSecure = (req, res, next) => {
  // test if they're running on HTTPS
  if (req.headers['x-forwarded-proto'] !== 'https') { // They are not running on HTTPS
    // Redirect them to the same URL but on HTTPS
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requireLogin = requireLogin;
module.exports.requireLogout = requireLogout;

// Check if we are testing locally (process.env.NODE_ENV === 'production' will only be true if
// we're running on heroku since thats how we set up the enviornemnt variables)
if (process.env.NODE_ENV === 'production') { // We are on heroku
  // Make sure its running on HTTPS
  module.exports.requireSecure = requireSecure;
} else { // We are testing locally
  // Bypass security
  module.exports.requireSecure = bypassSecure;
}
