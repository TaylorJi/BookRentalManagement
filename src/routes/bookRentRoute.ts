// write route for bookRent
// Path: src/routes/bookRoute.ts
import express from "express";
import { Request, Response } from "express";
import { Book } from "../models/book";
import { Customer } from "../models/customer";
import { BookRent } from "../models/bookRent";

export const bookRentRouter = express.Router();

// get all bookRents
bookRentRouter.get('/', async (req, res) => {
    console.log('Fetching bookRents from the database');
    try {
        // Populate both book_ID and customer_ID to fetch the related documents
        const bookRents = await BookRent.find({})
            .populate('book_ID', 'title') // Assuming you want to get the book's title
            .populate('customer_ID', 'name'); // Assuming you want to get the customer's name

        console.log(`Found ${bookRents.length} bookRents`);
        res.status(200).json(bookRents);
    } catch (error) {
        console.error('Error while fetching listings:', error);
        res.status(500).send('Error while fetching listings' + error);
    }
});
// bookRentRouter.get('/', async (req: Request, res: Response) => {
//     console.log('Fetching bookRents from the database');
//     try {
//       const bookRents = await BookRent.find({}).populate('book_ID').populate('customer_ID');
//       console.log(`Found ${bookRents.length} bookRents`);
//       res.status(200).json(bookRents);
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

// search by book_id
bookRentRouter.get('/searchByBook/:id', async (req: Request, res: Response) => {
    const {book_id} = req.query; // get the title from the query
    console.log('Fetching bookRents from the database');
    if (book_id === undefined || book_id === '' || typeof book_id !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const bookRents = await BookRent.find({book_id: book_id});
            console.log(`Found ${bookRents.length} bookRents`);
            if (bookRents.length === 0) {
                res.status(404).send('BookRent not found');
                return;
            }
            res.status(200).json(bookRents);
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


// search by customer_id
bookRentRouter.get('/searchByCustomer/:id', async (req: Request, res: Response) => {
    const {customer_id} = req.query; // get the title from the query
    console.log('Fetching bookRents from the database');
    if (customer_id === undefined || customer_id === '' || typeof customer_id !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const bookRents = await BookRent.find({customer_id: customer_id});
            console.log(`Found ${bookRents.length} bookRents`);
            if (bookRents.length === 0) {
                res.status(404).send('BookRent not found');
                return;
            }
            res.status(200).json(bookRents);
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

// add a bookRent
bookRentRouter.post('/', async (req: Request, res: Response) => {
    try {
        const {book_ID, customer_ID} = req.body;
        const book = await Book.findById(book_ID);
        if (!book) {
            res.status(404).send('Book not found');
            return;
        }
        console.log(book)
        const customer = await Customer.findById(customer_ID);
        if (!customer) {
            res.status(404).send('Customer not found');
            return;
        }
        const bookRent = new BookRent({
            book_ID,
            customer_ID
        });
        await bookRent.save();
        res.status(201).json(bookRent);
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
        const {book_id, customer_id, rent_date, return_date} = req.body;
        const bookRent = await BookRent.findById(req.params.id);
        if (!bookRent) {
            res.status(404).send('BookRent not found');
            return;
        }
        const book = await Book.findById(book_id);
        if (!book) {
            res.status(404).send('Book not found');
            return;
        }
        const customer = await Customer.findById(customer_id);
        if (!customer) {
            res.status(404).send('Customer not found');
            return;
        }
        bookRent.book_ID = book_id;
        bookRent.customer_ID = customer_id;
        bookRent.borrow_date = rent_date;
        bookRent.return_date = return_date;
        await bookRent.save();
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
