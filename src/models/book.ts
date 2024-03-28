import mongoose, { Schema, Document } from "mongoose";



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

    // Assuming that the genre has been populated or that you have the genre name available.
    // If it's just an ObjectId reference, you'll need to first fetch the genre from the database.
    if (book.genre) {
        // If genre is an ObjectId, fetch the genre document
        if (typeof book.genre === 'object' && book.genre._id) {
            const genreVal = await mongoose.model("Genre").findById(book.genre._id);
            if (!genreVal) {
                return next(new Error("Genre not found"));
            }
            book.rental_duration = (genreVal.name === "Old Book") ? 14 : 7;
        } else if (typeof book.genre === 'string') {
            // If genre is just the name (string) and not an ObjectId
            book.rental_duration = (book.genre === "Old Book") ? 14 : 7;
        }
    }

    next();
});

// bookSchema.pre("save", async function (next) {
//     const book = this;

//     if(book.genre){
//         const genreVal = await mongoose.model("Genre").findById(book.genre);
//         if(!genreVal){
//             return next(new Error("Genre not found"));
//         } else {
//             switch (genreVal.name) {
//                 case "New korean novel":
//                     book.rental_duration = 7;
//                     break;
//                 case "Comics":
//                     book.rental_duration = 7;
//                     break;
//                 default:
//                     book.rental_duration = 14;
//             }
//             // if (genreVal === "신간한국소설") {
//             //     book.rental_duration = 7;
//             // } else if (genreVal === "만화") {
//             //     book.rental_duration = 7;
//             // } else {
//             //     book.rental_duration = 14;
//             // }
//         }
//     }
//     next();
// })



export const Book = mongoose.model("Book", bookSchema, "books"); // the last input is to set the names of the collection in the database

