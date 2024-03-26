import mongoose, { Schema } from "mongoose";

const today = new Date();
const oneWeekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
const returnDate = oneWeekFromToday.toISOString();

let bookRentSchema = new mongoose.Schema({
    customer_ID: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    book_ID: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrow_date: {
        type: Date,
        default: today.toISOString(),
        required: true
    },
    return_date: {
        type: Date,
        default: returnDate,
        require: true
    },
    late_fee: {
        type: Number,
        required: false
    }

})



export const BookRent = mongoose.model("BookRent", bookRentSchema, "bookRents"); // the last input is to set the names of the collection in the database

