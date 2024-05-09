import mongoose, { Schema } from "mongoose";

const moment = require("moment-timezone");

const returnedBookSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    return_date: {
        type: Date,
        required: true
    },
    title: String,

});

let bookReturnSchema = new mongoose.Schema({
    customer_ID: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    returned_books: [returnedBookSchema],
    return_date: {
        type: Date,
        default: ()=> moment().tz("America/Vancouver").toDate(),
        required: true
    },
    late_fee: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: ["Completed", "Partial", "Overdue"],
        default: "Completed"
    },
    note: {
        type: String,
        required: false
    },
})



export const BookReturn = mongoose.model("BookReturn", bookReturnSchema, "bookReturns"); // the last input is to set the names of the collection in the database

