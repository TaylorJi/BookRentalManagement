import mongoose, { Schema } from "mongoose";

const borrowedBookSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId, // Assuming 'id' refers to a Book model's ObjectId
        ref: "Book"                  // Reference to the Book model if you want to populate this later
    },
    title: String
});


let customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    late_fee: {
        type: Number,
        required: false
    },
    rented_books: [borrowedBookSchema]

})

export const Customer = mongoose.model("Customer", customerSchema, "customers"); // the last input is to set the names of the collection in the database


