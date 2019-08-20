const Event = require("../../models/event");
const User = require('../../models/user');
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
  createEvent: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const findUser = await User.findById(req.userId);

      if (!findUser) {
        throw new Error("User not found!");
      }
      findUser.createdEvents.push(event);
      await findUser.save();
      
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  // Mutation: Delete Event
  deleteEvent: async (args, req) => {
    console.log(req.userId)
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const event = await Event.findById(args.eventId)
      if (event.creator.toString() === req.userId) {
        const deletedEvent = await Event.findByIdAndDelete(args.eventId);
        console.log('Deleted Event', deletedEvent);
      } else {
        throw new Error('You are Unauthorized to delete this event!')
      }
      return event
    } catch (error) {
      throw error
    }
  }
}