import { Router } from "express";
import { Request, Response } from "express";
import { BookReturn } from "../models/bookReturn";
import { BookRent } from "../models/bookRent";
import { mongo } from "mongoose";
import mongoose from "mongoose";
import { Book } from "../models/book";


interface BookType {
    _id: mongoose.Types.ObjectId;
    name: string;
    late_fee: number;
}

interface BorrowedBook {
    _id: mongoose.Types.ObjectId;
    id_str: string;
    title: string;
    book_type: BookType | mongoose.Types.ObjectId;
    fee: number;
    duration: number;
    return_date: Date;
    is_available: Boolean;
}

interface BookRentDocument extends mongoose.Document {
    customer_ID: mongoose.Types.ObjectId;
    borrowed_books: BorrowedBook[];
    borrow_date: Date;
    total_rent_fee?: number;
    late_fee?: number;
    status: "Borrowed" | "Returned" | "Overdue";
    note?: string;
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



// bookReturnRouter.post("/", async (req: Request, res: Response) => {
//     // let the admin put one of the book ID
//     // find the bookRent that has the book ID inside borrowed_books
//     // show the borrowed books as list 
//     // allow the admin to select the books to be returned
//     // calculate the late fee
//     // check if the selected books length is the same as the borrowed books length
//     // if not then the status is partial
//     // save the book return


//     console.log('Processing book return...');
//     const { books_to_return } = req.body;
//     let totalLateFee = 0;
//     let status = 'Completed';

//     try {
//         const regex = new RegExp(books_to_return[0].id + '$');
//         const currentDate = moment().tz("America/Vancouver").toDate();
//         const bookRent = await BookRent.findOne({ "borrowed_books.id": {$regex: regex} })
//                                 .populate("borrowed_books.book_type") as BookRentDocument;
//         console.log(bookRent)
//         if (!bookRent) {
//             return res.status(404).json({ message: "Original book rent not found for book ID: " + returned_book_id });
//         }
//         const customer_ID = bookRent.customer_ID;
//         console.log(customer_ID)

     

        

//         for (const book of bookRent.borrowed_books) {
//             if (selected_books_to_return.includes(book._id)) {
//                 if ('late_fee' in book.book_type) { // Type guard to check if book_type is populated
//                     const dueDate = moment(book.return_date);
//                     if (moment(currentDate).isAfter(dueDate)) {
//                         const daysLate = moment(currentDate).diff(dueDate, 'days');
//                         const lateFee = daysLate * book.book_type.late_fee;
//                         totalLateFee += lateFee;
//                     } else {
//                         console.log('Book returned on time');
//                         book.is_available = true;
//                         await Book.findByIdAndUpdate(book._id, { is_available: true }); // update book availability
//                     }
//                 } else {
//                     console.error("Book type is not populated for book ID: " + book._id);
//                 }
//             }
//         }

//         const bookReturn = new BookReturn({
//             customer_ID,
//             returned_books: bookRent.borrowed_books,
//             return_date: currentDate,
//             late_fee: totalLateFee,
//             status,
//             note: ''
//         });

//         await bookReturn.save();
//         res.status(201).json({ message: 'Book return processed successfully', bookReturn });
        
//     }catch (error) {
//         if (error instanceof Error) {
//             console.error('Error processing book return:', error.message);
//             res.status(500).json({ message: 'Internal server error', error: error.message });

//         } else {
//             console.error('Error processing book return:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     }
// });




bookReturnRouter.post("/", async (req: Request, res: Response) => {
    // let the admin put one of the book ID
    // find the bookRent that has the book ID inside borrowed_books
    // show the borrowed books as list 
    // allow the admin to select the books to be returned
    // calculate the late fee
    // check if the selected books length is the same as the borrowed books length
    // if not then the status is partial
    // save the book return


    console.log('Processing book return...');
    const { bookIDs} = req.body;
    let totalLateFee = 0;
    let status = 'Completed';

    try {
        const regex = new RegExp(bookIDs[0] + '$');
        console.log(regex)
        const currentDate = moment().tz("America/Vancouver").toDate();
        const bookRent = await BookRent.findOne({ "borrowed_books.id_str": {$regex: regex} })
                                .populate("borrowed_books.book_type") as BookRentDocument;
        console.log(bookRent)
        if (!bookRent) {
            return res.status(404).json({ message: "Original book rent not found for book ID: " + bookIDs[0] });
        }
        const customer_ID = bookRent.customer_ID;

        if (bookIDs.length != bookRent.borrowed_books.length) {
            status = 'Partial'; 
        }
        console.log("before for loop")

        // for (const book of bookRent.borrowed_books) {
        //     console.log("book id is " + book._id)
        //     if (selected_books_to_return.includes(book._id)) {
        //         if ('late_fee' in book.book_type) { // Type guard to check if book_type is populated
        //             const dueDate = moment(book.return_date);
        //             if (moment(currentDate).isAfter(dueDate)) {
        //                 const daysLate = moment(currentDate).diff(dueDate, 'days');
        //                 const lateFee = daysLate * book.book_type.late_fee;
        //                 totalLateFee += lateFee;
        //             } else {
        //                 console.log('Book returned on time');
        //                 book.is_available = true;
        //                 console.log(book._id)
        //                 Book.findOne({ _id: book._id }, function(err: any, book: { is_available: boolean; save: () => void; }) {
        //                     if (err) {
        //                         console.log(err)
        //                     } else {
        //                         book.is_available = true;
        //                         book.save();
        //                     }
        //                 }
        //                 )
        //                 // Book.findByIdAndUpdate(book._id, { is_available: true }); // update book availability
                        
        //             }
        //         } else {
        //             console.error("Book type is not populated for book ID: " + book._id);
        //         }
        //     }
        // }



        

        // for (const book of bookRent.borrowed_books) {
        //     if (selected_books_to_return.includes(book._id)) {
        //         if ('late_fee' in book.book_type) { // Type guard to check if book_type is populated
        //             const dueDate = moment(book.return_date);
        //             if (moment(currentDate).isAfter(dueDate)) {
        //                 const daysLate = moment(currentDate).diff(dueDate, 'days');
        //                 const lateFee = daysLate * book.book_type.late_fee;
        //                 totalLateFee += lateFee;
        //             } else {
        //                 console.log('Book returned on time');
        //                 book.is_available = true;
        //                 console.log(book._id)
        //                 Book.findOne({ _id: book._id }, function(err: any, book: { is_available: boolean; save: () => void; }) {
        //                     if (err) {
        //                         console.log(err)
        //                     } else {
        //                         book.is_available = true;
        //                         book.save();
        //                     }
        //                 }
        //                 )
        //                 // Book.findByIdAndUpdate(book._id, { is_available: true }); // update book availability
                        
        //             }
        //         } else {
        //             console.error("Book type is not populated for book ID: " + book._id);
        //         }
        //     }
        // }

        const bookReturn = new BookReturn({
            customer_ID,
            returned_books: bookRent.borrowed_books,
            return_date: currentDate,
            late_fee: totalLateFee,
            status,
            note: ''
        });

        await bookReturn.save();
        res.status(201).json({ message: 'Book return processed successfully', bookReturn });
        

        // for (const book of bookRent.borrowed_books) {
        //     console.log("book id is " + book._id)
        //     if (book._id == returned_book._id) {
        //         const dueDate = moment(book.return_date);
        //         if (moment(currentDate).isAfter(dueDate)) {
        //             const daysLate = moment(currentDate).diff(dueDate, 'days');
        //             const lateFee = daysLate * book.book_type.late_fee;
        //             totalLateFee += lateFee;
        //         } else {
        //             console.log('Book returned on time');
        //             book.is_available = true;
        //         }
        //     }
        // }
        

        // for (const book of returned_books) {
        //     console.log("book id is " + book._id)
        //     const bookRent = await BookRent.findOne({ "borrowed_books._id": book._id });
        //     console.log(bookRent)

        //     if (!bookRent) {
        //         return res.status(404).json({ message: "Original book rent not found for book ID: " + book._id });
        //     }

        //     if (returned_books.length != bookRent.borrowed_books.length) {
        //         status = 'Partial'; 
        //     }

        //     const dueDate = moment(book.return_date);
        //     if (moment(currentDate).isAfter(dueDate)) {
        //         const daysLate = moment(currentDate).diff(dueDate, 'days');
        //         const lateFee = daysLate * book.book_type.late_fee;
        //         totalLateFee += lateFee;
        //     } else {
        //         console.log('Book returned on time');
        //         book.is_available = true;            }
        // }

        // const bookReturn = new BookReturn({
        //     customer_ID,
        //     returned_books,
        //     return_date,
        //     late_fee: totalLateFee,
        //     status,
        //     note
        // });

        // await bookReturn.save();
        // res.status(201).json({ message: 'Book return processed successfully', bookReturn });
    }catch (error) {
        if (error instanceof Error) {
            console.error('Error processing book return:', error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });

        } else {
            console.error('Error processing book return:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});