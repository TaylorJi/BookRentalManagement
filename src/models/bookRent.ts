import mongoose, { Schema } from "mongoose";

// const today = new Date();
// const oneWeekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
// const returnDate = oneWeekFromToday.toISOString();
const moment = require("moment-timezone");

let bookRentSchema = new mongoose.Schema({
    customer_ID: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    books: [],
    borrow_date: {
        type: Date,
        default: ()=> moment().tz("America/Vancouver").toDate(),
        required: true
    },
    total_rent_fee: { // total rent_fee for this rent transaction
        type: Number,
        required: false
    },
    late_fee: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: ["Borrowed", "Returned", "Overdue"],
        default: "Borrowed"
    }

})



export const BookRent = mongoose.model("BookRent", bookRentSchema, "bookRents"); // the last input is to set the names of the collection in the database

