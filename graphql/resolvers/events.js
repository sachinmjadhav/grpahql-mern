const Event = require("../../models/event");
const {dateToString} = require("../../helpers/date");
const { transformEvent } = require('./merge');

module.exports = {
  // Query: Events
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  // Mutation: Create Events
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: "5d5263c142174a1d4d4f63aa"
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const findUser = await User.findById(
        "5d5263c142174a1d4d4f63aa"
      );
      if (!findUser) {
        throw new Error("User not found!");
      }
      findUser.createdEvents.push(event);
      await findUser.save();
      return {...createdEvent};
    } catch (err) {
      throw err;
    }
  }
}