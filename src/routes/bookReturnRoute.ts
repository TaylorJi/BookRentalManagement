import { Router } from "express";
import { Request, Response } from "express";
import { BookReturn } from "../models/bookReturn";
import { BookRent } from "../models/bookRent";


interface BookType {
    name: string;
    late_fee: number;
}

interface Book {
    _id: string;
    book_type: BookType;
    return_date: Date;
    is_available: boolean;
}

export const bookReturnRouter = Router();
const moment = require("moment-timezone");


bookReturnRouter.get("/", async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Book return route is working' });
})


bookReturnRouter.post("/bookReturn", async (req: Request, res: Response) => {
    console.log('Processing book return...');
    const { customer_ID, returned_books, return_date, note } = req.body;
    let totalLateFee = 0;
    let status = 'Completed';

    try {
        const currentDate = moment().tz("America/Vancouver").toDate();
        console.log(currentDate)

        for (const book of returned_books) {
            console.log("book id is " + book._id)
            const bookRent = await BookRent.findOne({ "borrowed_books._id": book._id });
            console.log(bookRent)

            if (!bookRent) {
                return res.status(404).json({ message: "Original book rent not found for book ID: " + book._id });
            }

            if (returned_books.length != bookRent.borrowed_books.length) {
                status = 'Partial'; // Set to partial if counts do not match
            }

            const dueDate = moment(book.return_date);
            if (moment(currentDate).isAfter(dueDate)) {
                const daysLate = moment(currentDate).diff(dueDate, 'days');
                const lateFee = daysLate * book.book_type.late_fee;
                totalLateFee += lateFee;
            } else {
                console.log('Book returned on time');
                book.is_available = true;            }
        }

        const bookReturn = new BookReturn({
            customer_ID,
            returned_books,
            return_date,
            late_fee: totalLateFee,
            status,
            note
        });

        await bookReturn.save();
        res.status(201).json({ message: 'Book return processed successfully', bookReturn });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error processing book return:', error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });

        } else {
            console.error('Error processing book return:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});




