import mongoose, { Schema } from "mongoose";
import { Book } from "./book";

const moment = require("moment-timezone");

const borrowedBookSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId, // Assuming 'id' refers to a Book model's ObjectId
        ref: "Book"                  // Reference to the Book model if you want to populate this later
    },
    title: String,
    fee: Number,
    duration: Number,
    return_date: Date
});

let bookRentSchema = new mongoose.Schema({
    customer_ID: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    borrowed_books: [borrowedBookSchema],
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
    },
    note: {
        type: String,
        required: false
    },
})



export const BookRent = mongoose.model("BookRent", bookRentSchema, "bookRents"); // the last input is to set the names of the collection in the database

