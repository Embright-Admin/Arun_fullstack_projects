const jwt = require('jsonwebtoken');
const {User} = require('../models/User')
const auth={
   authenticate : (req, res, next) => {
    let token = req.header('x-access-token');
    
    jwt.verify(token, User.getJWTSecret(),  (err, decoded) => {
      if (err) {
      
        res.status(401).send(err);
      } else {
        req.user_id= decoded._id;
        next();
      }
    });
  },
  
   verifySession : (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
  
    let _id = req.header('_id');
  
    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }
  
  
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;
  
        let isSessionValid = false;
  
        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });
       
  
        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }
  
    }).catch((e) => {
        res.status(401).send(e);
    })
  }
}


module.exports = auth