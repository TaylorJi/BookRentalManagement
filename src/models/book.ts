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
        required: false
    },
    is_available: {
        type: Boolean,
        default: true
    }

})

bookSchema.pre("save", async function (next) {
    const book = this;

    if(book.genre){
        const genreVal = await mongoose.model("Genre").findById(book.genre);
        if(!genreVal){
            return next(new Error("Genre not found"));
        } else {
            if (genreVal === "신간한국소설") {
                book.rental_duration = 7;
            } else if (genreVal === "만화") {
                book.rental_duration = 7;
            } else {
                book.rental_duration = 14;
            }
        }
    }
})



export const Book = mongoose.model("Book", bookSchema, "books"); // the last input is to set the names of the collection in the database

