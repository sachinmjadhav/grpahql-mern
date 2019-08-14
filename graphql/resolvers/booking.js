const Booking = require("../../models/booking");
const Event = require("../../models/event");
const {transformBooking, transformEvent} = require("./merge");

module.exports = {
  // Query: Bookings
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking._doc);
      });
    } catch (error) {
      throw error;
    }
  },

  // Mutation: Book an event
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({_id: args.eventId});
    const booking = new Booking({
      user: "5d5263c142174a1d4d4f63aa",
      event: fetchedEvent.id
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  // Mutation: Cancel Booking
  cancelBooking: async args => {
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
