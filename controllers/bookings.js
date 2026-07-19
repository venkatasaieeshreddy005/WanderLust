const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");


module.exports.showbookings=module.exports.showbookings = async (req, res) => {

    let filter = {
        user: req.user._id
    };


    // filter by status
    if(req.query.status){

        filter.bookingStatus = req.query.status;

    }


    const bookings = await Booking.find(filter)
        .populate("listing");


    res.render("bookings/showBookings", {
        bookings,
        selectedStatus: req.query.status || "All"
    });

};;
module.exports.cancelBooking=async (req, res) => {

    const booking = await Booking.findById(req.params.id);


    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/listings/bookings");
    }


    // check ownership
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You cannot cancel this booking");
        return res.redirect("/listings/bookings");
    }


    booking.bookingStatus = "Cancelled";


    await booking.save();


    req.flash(
        "success",
        "Booking cancelled successfully"
    );


    res.redirect("/listings/bookings");

};

module.exports.renderBookingForm = async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    res.render("bookings/bookNow", {
        listing,
        currUser: req.user
    });

};




module.exports.createBooking = async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }


    const {
        fullName,
        email,
        phone,
        adults,
        children,
        rooms,
        roomType,
        checkIn,
        checkOut,
        notes
    } = req.body;



    const oneDay = 1000 * 60 * 60 * 24;


    const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / oneDay
    );


    const total = listing.price * rooms * nights;



    const requests = req.body.specialRequests || {};



    const booking = new Booking({

        listing: listing._id,

        user: req.user._id,


        fullName,

        email,

        phone,

        adults,

        children,

        rooms,

        roomType,

        checkIn,

        checkOut,


        totalPrice: total,


        specialRequests: {

            earlyCheckIn: requests.earlyCheckIn === "true",

            lateCheckOut: requests.lateCheckOut === "true",

            extraBed: requests.extraBed === "true",

            highFloor: requests.highFloor === "true",

            smoking: requests.smoking === "true",

            notes: notes

        }

    });



    await booking.save();


    req.flash(
        "success",
        "Booking Confirmed!"
    );


    res.redirect("/listings");

};