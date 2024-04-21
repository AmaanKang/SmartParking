// middleware.js
function isAdmin(req, res, next) {
    // Replace this with your actual logic for checking if the user is an admin
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  }
  
  module.exports = isAdmin;