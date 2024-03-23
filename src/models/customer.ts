import mongoose, { Schema } from "mongoose";



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
    }

})



module.exports = mongoose.model("Customer", customerSchema);