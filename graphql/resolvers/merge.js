const DataLoader = require('dataloader');
const Event = require("../../models/event");
const User = require("../../models/user");
const {dateToString} = require("../../helpers/date");

// DataLoader helps in combining multiple requests into a single big request

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({_id: {$in: userIds}});
});

// Fn: Get User from userId
const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// Fn: Get list of events from array of eventIds
const events = async eventIds => {
  try {
    const events = await Event.find({_id: {$in: eventIds}});
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

// Fn: Get single event from the eventId
const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.events = events;
