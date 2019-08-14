const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
  // Query: Users
  users: () => {
    User.find()
      .then(users => {
        return users.map(user => {
          return {
            ...user._doc,
            createdEvents: events.bind(this, user.createdEvents)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },

  // Mutation: Create Users
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error("User Already Exists.");
      }
      const hashedPassword = await bcrypt.hash(
        args.userInput.password,
        12
      );
      const user_1 = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user_1.save();
      return {
        ...result._doc,
        createdEvents: events.bind(this, result.createdEvents),
        password: null
      };
    } catch (err) {
      throw err;
    }
  },
};