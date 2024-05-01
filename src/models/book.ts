import mongoose, { Schema } from "mongoose";



let bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    book_type: {
        type: Schema.Types.ObjectId,
        ref: "Type", // reference the Type model (name of the model)
        required: true
    },
    
    is_available: {
        type: Boolean,
        default: true
    },
    borrow_count: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 32.5
    }

})




export const Book = mongoose.model("Book", bookSchema, "books"); // the last input is to set the names of the collection in the database

