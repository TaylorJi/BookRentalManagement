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
    }

})



// bookSchema.pre("save", async function (next) {
//     const book = this;

//     // Fetch the genre document if genre is an ObjectId
//     let typeVal;
//     if (typeof book.type === 'object' && book.type._id) {
//         typeVal = await mongoose.model("Type").findById(book.type._id);
//         console.log(typeVal); 
//     } else if (typeof book.type === 'string') {
//         // If genre is a string, assume it's the genre name
//         typeVal = { type: book.type };
//     }

//     if (!typeVal) {
//         return next(new Error("Type not found"));
//     } else {
//         book.rental_duration = typeVal.duration;
//         book.rent_fee = typeVal.fee;
//     }


//     next();
// });


// bookSchema.pre("save", async function (next) {
//     const book = this;

//     // Fetch the genre document if genre is an ObjectId
//     let genreVal;
//     if (typeof book.genre === 'object' && book.genre._id) {
//         genreVal = await mongoose.model("Genre").findById(book.genre._id);
//         console.log(genreVal); 
//     } else if (typeof book.genre === 'string') {
//         // If genre is a string, assume it's the genre name
//         genreVal = { genre: book.genre };
//     }

//     if (!genreVal) {
//         return next(new Error("Genre not found"));
//     }

//     // Set rental_duration and rent_fee based on genre
//     switch (genreVal.genre) {
//         case "Old Book":
//             book.rental_duration = 14;
//             book.rent_fee = 3;
//             break;
//         case "New Release":
//             book.rental_duration = 7;
//             book.rent_fee = 5;
//             break;
//         // Add more cases as needed for different genres
//         default:
//             book.rental_duration = 7;  // Default value
//             book.rent_fee = 4;         // Default value
//     }

//     next();
// });
// bookSchema.pre("save", async function (next) {
//     const book = this;

//     // Assuming that the genre has been populated or that you have the genre name available.
//     // If it's just an ObjectId reference, you'll need to first fetch the genre from the database.
//     if (book.genre) {
//         // If genre is an ObjectId, fetch the genre document
//         if (typeof book.genre === 'object' && book.genre._id) {
//             const genreVal = await mongoose.model("Genre").findById(book.genre._id);
//             if (!genreVal) {
//                 return next(new Error("Genre not found"));
//             }
//             book.rental_duration = (genreVal.name === "Old Book") ? 14 : 7;
//             book.rent_fee = (genreVal.name === "Old Book") ? 3 : 4;
//         } else if (typeof book.genre === 'string') {
//             // If genre is just the name (string) and not an ObjectId
//             book.rental_duration = (book.genre === "Old Book") ? 14 : 7;
//             book.rent_fee = (book.genre === "Old Book") ? 3 : 4;
//         }
//     }

//     next();
// });

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

