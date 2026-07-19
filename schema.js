const Joi = require("joi");

// ================= Listing Validation =================

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),

        description: Joi.string().required(),

        location: Joi.string().required(),

        country: Joi.string().required(),

        price: Joi.number()
            .min(0)
            .required(),

        image: Joi.string().allow("", null),

        category: Joi.string()
            .valid(
                "Rooms",
                "Mountains",
                "Castles",
                "Camping",
                "Farms",
                "Beach",
                "Arctic"
            )
            .required()
    }).required()
});


// ================= Review Validation =================

module.exports.reviewschema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),

        comment: Joi.string().required()
    }).required()
});


// ================= Booking Validation =================

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({

        fullName: Joi.string()
            .trim()
            .min(3)
            .max(100)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.pattern.base": "Phone number must contain exactly 10 digits."
            }),

        adults: Joi.number()
            .integer()
            .min(1)
            .required(),

        children: Joi.number()
            .integer()
            .min(0)
            .default(0),

        rooms: Joi.number()
            .integer()
            .min(1)
            .required(),

        roomType: Joi.string()
            .valid("Standard", "Deluxe", "Suite")
            .required(),

        checkIn: Joi.date()
            .required(),

        checkOut: Joi.date()
            .greater(Joi.ref("checkIn"))
            .required()
            .messages({
                "date.greater": "Check-out date must be after check-in date."
            }),

        earlyCheckIn: Joi.boolean(),

        lateCheckOut: Joi.boolean(),

        extraBed: Joi.boolean(),

        highFloor: Joi.boolean(),

        smoking: Joi.boolean(),

        notes: Joi.string()
            .allow("")
            .max(500),

        totalPrice: Joi.number()
            .min(0)
            .optional()

    }).required()
});