import mongoose, { Schema } from "mongoose";



let bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    },
    rental_duration: {
        type: Number,
        required: true
    },
    is_available: {
        type: Boolean,
        default: true
    }

})



export const Book = mongoose.model("Book", bookSchema, "books"); // the last input is to set the names of the collection in the database

