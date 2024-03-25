import mongoose from "mongoose";



let genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true
    }
  

})



export const Genre = mongoose.model("Genre", genreSchema, "genres");