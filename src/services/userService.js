// // services/user.service.js
// const User = require('../models/user.model');

// async function findOrCreateUser(profile) {
//   const { id, username, emails } = profile;
//   const email = emails[0].value;
//   let user = await User.findOne({ githubId: id });

//   if (!user) {
//     user = await User.create({ githubId: id, username, email });
//   }

//   return user;
// }

// module.exports = {
//   findOrCreateUser
// };
