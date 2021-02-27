const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

/**
 * function to set up JWT token setings
 * 
 * @param {string} user - function setup to generate token 
 * @param {string} experation - Experation time for the token is 7 days
 *  
 */

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

// after login

/**
 *function to make token works with login user data
 *  
 * @param {function} router function to create the JWTToken for user after login 
 * @returns {token} return token to the JSON file or DataBase untill expiring 
 */


module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', {
      session: false
    }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right.',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
