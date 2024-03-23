import { ObjectId } from "mongoose";

export default class Review {
    constructor(
        public name: string,
        public summary: string,
        public room_type: string,){}}