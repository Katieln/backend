//** config localStrategy y GitHubStrategy **//

const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const { createHash, isValidPassword } = require('../utils/bcrypt');


  //**************** LocalStrategy ***************//

const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        let userData = req.body;
        let user = await User.findOne({ email: username });
        if (user) {
          return done(null, false, { message: 'Usuario ya existe' });
        }
        let userNew = {
          method: 'local',
          username: userData.username,
          email: userData.email,
          lastname: userData.lastname,
          password: createHash(userData.password),
          address: userData.address,
          phone: userData.phone,
          role: userData.role
        };
        let result = await User.create(userNew);
        return done(null, result);
      } catch (err) {
        return done(err, false, { message: 'Error al crear usuario' });
      }
    }
  ));


  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!isValidPassword(password, user.password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));



   //**************** GitHub ***************//

   passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      // Buscar o crear usuario
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        let newUser = ({
          method: 'github',
          githubId: profile.id,
          username: profile.username,
          email: email,
          address: 'futureAddress', 
          displayName: profile.displayName,
          profileUrl: profile.profileUrl,
          avatarUrl: profile._json.avatar_url,
          role: 'user'
        });
        let result = await User.create(newUser);
        done(null, result);
      }
      else{ done(null, user);}
    } catch (error) {
      return done(error);
    }
  }
));


// ******************************************* //
// Serialización y deserialización de usuario

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    method: user.method,
    email: user.email,
    address: user.address,
    connectionTime: new Date(),
    roles: user.roles
  });
});

passport.deserializeUser(async (sessionData, done) => {
  try {
    let user = await User.findById(sessionData.id);
    if (user) {
      done(null, { ...user.toObject(), ...sessionData });
    } else {
      done(null, sessionData);  
    }
  } catch (err) {
    done(err, false);
  }
});
};

module.exports = initializePassport;
