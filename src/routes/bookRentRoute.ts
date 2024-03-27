// write route for bookRent
// Path: src/routes/bookRoute.ts
import express from "express";
import { Request, Response } from "express";
import { Book } from "../models/book";
import { Customer } from "../models/customer";
import { BookRent } from "../models/bookRent";

export const bookRentRouter = express.Router();
const moment = require("moment-timezone");

// get all bookRents
bookRentRouter.get('/', async (req, res) => {
    console.log('Fetching bookRents from the database');
    try {
        // Populate both book_ID and customer_ID to fetch the related documents
        const bookRents = await BookRent.find({})
            .populate('book_ID', 'title') // Assuming you want to get the book's title
            .populate('customer_ID', 'name'); // Assuming you want to get the customer's name

        console.log(`Found ${bookRents.length} bookRents`);
        const bookRentsInVancouverTime = bookRents.map(bookRent => {
            const borrowDateInVancouver = moment(bookRent.borrow_date).tz('America/Vancouver').format();
            const returnDateInVancouver = moment(bookRent.return_date).tz('America/Vancouver').format();
            
            return {
                ...bookRent.toObject(),
                borrow_date: borrowDateInVancouver,
                return_date: returnDateInVancouver
            };
        });
        res.status(200).json(bookRentsInVancouverTime);
    } catch (error) {
        console.error('Error while fetching listings:', error);
        res.status(500).send('Error while fetching listings' + error);
    }
});

// search by book_id
bookRentRouter.get('/searchByBook/:id', async (req, res) => {
    const book_id = req.params.id; // Use req.params for route parameters
    console.log('Fetching bookRents for book ID:', book_id);
    if (!book_id) {
        res.status(400).send('Invalid book ID');
        return;
    }
    try {
        const bookRents = await BookRent.find({ book_ID: book_id })
            .populate('customer_ID', 'name')
            .populate('book_ID', 'title');

        console.log(`Found ${bookRents.length} bookRents`);
        if (bookRents.length === 0) {
            res.status(404).send('BookRent not found');
            return;
        }
        res.status(200).json(bookRents);
    } catch (error) {
        console.error('Error while fetching listings:', error);
        res.status(500).send('Error while fetching listings' + error);
    }
});



// search by customer_id
bookRentRouter.get('/searchByCustomer/:id', async (req, res) => {
    const customer_ID = req.params.id; // Use req.params for route parameters
    console.log('Fetching bookRents for customer ID:', customer_ID);
    if (!customer_ID) {
        res.status(400).send('Invalid customer ID');
        return;
    }
    try {
        const bookRents = await BookRent.find({ customer_ID: customer_ID })
            .populate('customer_ID', 'name')
            .populate('book_ID', 'title');

        console.log(`Found ${bookRents.length} bookRents`);
        if (bookRents.length === 0) {
            res.status(404).send('BookRent not found');
            return;
        }
        res.status(200).json(bookRents);
    } catch (error) {
        console.error('Error while fetching listings:', error);
        res.status(500).send('Error while fetching listings' + error);
    }
});


// add a bookRent
// insert one param that tells about the genre of the book, based on the genre, the return date will be set
bookRentRouter.post('/', async (req: Request, res: Response) => {
    try {
        const {book_ID, customer_ID} = req.body;
        const book = await Book.findById(book_ID).populate('genre');
        if (!book) {
            return res.status(404).send('Book not found');
        }
        if(!book.is_available){
            return res.status(404).send('Book is not available');
            
        }
        console.log(book)
        const customer = await Customer.findById(customer_ID);
        if (!customer) {
            res.status(404).send('Customer not found');
            return;
        }
        const bookRent = new BookRent({
            book_ID,
            customer_ID,
            borrow_date: new Date()
        });
        book.is_available = false; // setting the book as unavailable
        await book.save();
        await bookRent.save();
        const borrowDateVancouver = moment(bookRent.borrow_date).tz('America/Vancouver').format();
        const returnDateVancouver = moment(bookRent.borrow_date).tz('America/Vancouver').add(book.rental_duration, 'days').format();

        // const returnDateVancouver = bookRent.return_date ? moment(bookRent.return_date).tz('America/Vancouver').format() : null;
        const responseObj = {
            ...bookRent.toObject(),
            borrow_date: borrowDateVancouver,
            return_date: returnDateVancouver
        };

        res.status(201).json(responseObj);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings' + error);
        } else {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings');
        }
    }
  });

  // update a bookRent
bookRentRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const {book_ID, customer_ID, borrow_date, return_date} = req.body;
        const bookRent = await BookRent.findById(req.params.id);
        if (!bookRent) {
            res.status(404).send('BookRent not found');
            return;
        }
        const book = await Book.findById(book_ID);
        if (!book) {
            res.status(404).send('Book not found');
            return;
        }
        const customer = await Customer.findById(customer_ID);
        if (!customer) {
            res.status(404).send('Customer not found');
            return;
        }
        bookRent.book_ID = book_ID;
        bookRent.customer_ID = customer_ID;
        bookRent.borrow_date = borrow_date;
        bookRent.return_date = return_date;
        await bookRent.save();
        book.is_available = false; // setting the book as unavailable
        res.status(200).json(bookRent);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings' + error);
        } else {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings');
        }
    }
  });

// delete a bookRent
bookRentRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await BookRent.findByIdAndDelete(id);
        res.status(200).json("BookRent deleted successfully");
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings' + error);
        } else {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings');
        }
    }
  });


  // return a book
  bookRentRouter.put('/return/:id', async (req, res) => {
    try {
        const bookRent = await BookRent.findById(req.params.id);
        if (!bookRent) {
            return res.status(404).send('BookRent not found');
        }

        // Create Moment objects for now and return date in Vancouver time
        const nowInVancouver = moment.tz('America/Vancouver');
        const returnDateInVancouver = moment(bookRent.return_date).tz('America/Vancouver');

        // Set the actual return date to now
        bookRent.return_date = nowInVancouver.toDate();

        // Check if the book is returned late
        if (bookRent.return_date && returnDateInVancouver.isValid() && nowInVancouver.isAfter(returnDateInVancouver)) {
            const diffInDays = nowInVancouver.diff(returnDateInVancouver, 'days');
            const lateFee = diffInDays * 0.5; // Assuming $0.5 per day late fee
            bookRent.late_fee = lateFee;
        }

        await bookRent.save();

        const book = await Book.findById(bookRent.book_ID);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        book.is_available = true; // Set the book as available
        await book.save();
        console.log(book)

        res.status(200).json(bookRent);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error while returning the book:', error);
            res.status(500).send('Error while returning the book: ' + error.message);
        } else {
            console.error('Error while returning the book:', error);
            res.status(500).send('Error while returning the book');
        }
    }
});


// bookRentRouter.put('/return/:id', async (req: Request, res: Response) => {
//     try {
//         const bookRent = await BookRent.findById(req.params.id);
//         if (!bookRent) {
//             res.status(404).send('BookRent not found');
//             return;
//         }
//         const nowInVancouver = moment.tz('America/Vancouver');
//         const returnDateInVancouver = moment(bookRent.return_date).tz('America/Vancouver');
//         bookRent.return_date = nowInVancouver.toDate();

//         if (returnDateInVancouver.isVald() && nowInVancouver > returnDateInVancouver) {
//             const diffInDays = nowInVancouver.diff(returnDateInVancouver, 'days');
//             const lateFee = diffInDays * 0.5;
//             bookRent.late_fee = lateFee;

//         }

//         bookRent.return_date = new Date();
//         await bookRent.save();
//         const book = await Book.findById(bookRent.book_ID);
//         if (!book) {
//             res.status(404).send('Book not found');
//             return;
//         }
//         book.is_available = true; // setting the book as available
//         await book.save();
//         res.status(200).json(bookRent);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error while fetching listings:', error);
//             res.status(500).send('Error while fetching listings' + error);
//         } else {
//             console.error('Error while fetching listings:', error);
//             res.status(500).send('Error while fetching listings');
//         }
//     }
//   });