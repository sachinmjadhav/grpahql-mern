const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { events } = require('./merge');

module.exports = {
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

  // Query: Login user
  login: async ({email, password}) => {
    const user = await User.findOne({email});
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email},
      "thisisasupersecretkey",
      {
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  }
};
