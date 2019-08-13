const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  }
  catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  }
  catch (err) {
    throw err;
  }
};


module.exports = {
  // Query: Events
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
    }
    catch (err) {
      throw err;
    }
  },

  // Mutation: Create Events
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5d5263c142174a1d4d4f63aa"
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result,
        date: new Date(result.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const findUser = await User.findById("5d5263c142174a1d4d4f63aa");
      if (!findUser) {
        throw new Error("User not found!");
      }
      findUser.createdEvents.push(event);
      await findUser.save();
      return { ...createdEvent._doc };
    }
    catch (err) {
      throw err;
    }
  },

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
      })
    },

  // Mutation: Create Users
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User Already Exists.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
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
    }
    catch (err) {
      throw err;
    }
  }
}