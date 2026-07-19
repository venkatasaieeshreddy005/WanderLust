const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    listing: {
        type: Schema.Types.ObjectId,
        ref: "listing",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    adults: {
        type: Number,
        required: true
    },

    children: {
        type: Number,
        default: 0
    },

    rooms: {
        type: Number,
        required: true
    },

    roomType: {
        type: String,
        default: "Standard"
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    specialRequests: {
        earlyCheckIn: Boolean,
        lateCheckOut: Boolean,
        extraBed: Boolean,
        highFloor: Boolean,
        smoking: Boolean,
        notes: String
    },

    totalPrice: Number,

    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Confirmed"
    },

    bookedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Booking", bookingSchema);