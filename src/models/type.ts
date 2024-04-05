import mongoose from "mongoose";



let typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
  

})



export const Type = mongoose.model("Type", typeSchema, "types");