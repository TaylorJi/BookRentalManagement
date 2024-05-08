// write route for bookRent
// Path: src/routes/bookRoute.ts
import express from "express";
import { Request, Response } from "express";
import { Book } from "../models/book";
import { Customer } from "../models/customer";
import { BookRent } from "../models/bookRent";

export const bookRentRouter = express.Router();
const moment = require("moment-timezone");


interface Customer {
    _id: string;
    name: string;
    contact: string;
    address: string;
    note: string;
    late_fee: number;

}

interface BookType {
    name: string;
    fee: number;
    duration: number;
}

interface Book{
    _id: string;
    id_str: string;
    title: string;
    book_type: BookType;
    is_available: boolean;
    borrow_count: number;
}

// get all bookRents
bookRentRouter.get('/', async (req, res) => {
    console.log('Fetching bookRents from the database');
    try {
        // Populate both book_ID and customer_ID to fetch the related documents
        const bookRents = await BookRent.find({})
            .populate('customer_ID'); 

        console.log(`Found ${bookRents.length} bookRents`);
        const bookRentsInVancouverTime = bookRents.map(bookRent => {
            const borrowDateInVancouver = moment(bookRent.borrow_date).tz('America/Vancouver').format();
            
            return {
                ...bookRent.toObject(),
                borrow_date: borrowDateInVancouver,
            };
        });
        res.status(200).json(bookRentsInVancouverTime);
    } catch (error) {
        console.error('Error while fetching listings:', error);
        res.status(500).send('Error while fetching listings' + error);
    }
});


bookRentRouter.get('/searchByBook/:id', async (req, res) => {
    const book_id = req.params.id;
    console.log('Fetching bookRents for book ID:', book_id);

    try {
        // Update the query to match the nested structure
        const bookRents = await BookRent.find({ 'borrowed_books.id': book_id })
            .populate('customer_ID', 'name')
        console.log(bookRents);

        console.log(`Found ${bookRents.length} bookRents`);
        if (bookRents.length === 0) {
            res.status(404).send('BookRent not found');
            return;
        }
        res.status(200).json(bookRents);
    } catch (error) {
        console.error('Error while fetching bookRents:', error);
        res.status(500).send('Internal Server Error');
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
            .populate('borrowed_books.id', 'title');

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



// add a bookRent, this is for check out a book
// insert one param that tells about the genre of the book, based on the genre, the return date will be set
bookRentRouter.post('/', async (req: Request, res: Response) => {
    let borrowBooks = [];
    try {
        const { customer_ID, books } = req.body;

        // Check if the customer exists
        const customer = await Customer.findById(customer_ID);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        console.log(customer)

        let totalFee = 0;

        // Iterate through each book in the request
        for (const bookData of books) {
            console.log(bookData);
            console.log(bookData.book_id);

            // Check if the book exists
            const book = await Book.findById(bookData.book_id).populate('book_type') as Book;
            if (!book) {
                return res.status(404).send(`Book with ID ${bookData} not found`);
            } else if (!book.is_available) {
                return res.status(404).send(`Book with ID ${bookData} is not available`);
            }

            const duration = bookData.duration;
            console.log("duration is:" + duration);

            const fee = bookData.fee;
            console.log("fee is:" + fee);

            // Calculate and update the total fee
            totalFee += fee;
            book.is_available = false; // Set the book as unavailable
            book.borrow_count += 1; // Increment the borrow count

            const updatedCustomer = await Customer.findByIdAndUpdate(
                customer_ID,
                { $push: { rented_books: book } },
                { new: true } // To return the updated document
            );
            console.log(updatedCustomer);
        

            await Book.findByIdAndUpdate(bookData.book_id, {
                $set: { is_available: false },
                $inc: { borrow_count: 1 }
            });
            const returnDateVancouver = moment().tz('America/Vancouver').add(duration, 'days').format();
            borrowBooks.push({ 
                id: book._id, 
                id_str: book._id.toString(),
                title: book.title, 
                fee: book.book_type.fee, 
                duration: duration, 
                return_date: returnDateVancouver });

        }

        // Create a new book rental record
        const bookRental = new BookRent({
            customer_ID,
            borrowed_books: borrowBooks,
            borrow_date: moment().tz('America/Vancouver'),
            total_rent_fee: totalFee
        });

        const savedBookRent = await bookRental.save();
        console.log(savedBookRent);


  

        // Perform any other rental operations here

        res.status(200).json({ message: 'Books rented successfully',
        bookRent: savedBookRent });
        
   
    } catch (error) {
        console.error('Error while processing book rental:', error);
        res.status(500).send('Error while processing book rental');
    }
});


// update a bookRent
// update books that are rented
// status
// and return date
bookRentRouter.put('/update/:id', async (req: Request, res: Response) => {
    const rent_id = req.params.id;
    const { borrowed_books, status, return_date } = req.body;
    console.log('Updating bookRent:', rent_id); 
    try {
        const bookRent = await BookRent.findById(rent_id);
        if (!bookRent) {
            return res.status(404).send('BookRent not found');
        }
        bookRent.borrowed_books = borrowed_books;
        bookRent.status = status;
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
//   bookRentRouter.put('/return/:id', async (req, res) => {
//     try {
//         const bookRent = await BookRent.findById(req.params.id);
//         if (!bookRent) {
//             return res.status(404).send('BookRent not found');
//         }

//         // Create Moment objects for now and return date in Vancouver time
//         const nowInVancouver = moment.tz('America/Vancouver');
//         const returnDateInVancouver = moment(bookRent.return_date).tz('America/Vancouver');

//         // Set the actual return date to now
//         bookRent.return_date = nowInVancouver.toDate();

//         // Check if the book is returned late
//         if (bookRent.return_date && returnDateInVancouver.isValid() && nowInVancouver.isAfter(returnDateInVancouver)) {
//             const diffInDays = nowInVancouver.diff(returnDateInVancouver, 'days');
//             const lateFee = diffInDays * 0.5; // Assuming $0.5 per day late fee
//             bookRent.late_fee = lateFee;
//         }

//         await bookRent.save();

//         const book = await Book.findById(bookRent.book_ID);
//         if (!book) {
//             return res.status(404).send('Book not found');
//         }

//         book.is_available = true; // Set the book as available
//         await book.save();
//         console.log(book)

//         res.status(200).json(bookRent);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error while returning the book:', error);
//             res.status(500).send('Error while returning the book: ' + error.message);
//         } else {
//             console.error('Error while returning the book:', error);
//             res.status(500).send('Error while returning the book');
//         }
//     }
// });


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