const Booking = require("../../models/booking");
const Event = require("../../models/event");
const {transformBooking, transformEvent} = require("./merge");

module.exports = {
  // Query: Bookings
  bookings: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  // Mutation: Book an event
  bookEvent: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({_id: args.eventId});
    const allBookings = await Booking.find();
    allBookings.forEach(booking => {
      if(fetchedEvent._id.toString() === booking.event.toString()) {
        throw new Error('Already Booked')
      }
    })
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent.id
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  // Mutation: Cancel Booking
  cancelBooking: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate(
        "event"
      );
      const event = transformEvent(booking.event);
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (error) {
      throw error;
    }
  }
};
