import { Router } from "express";
import { Request, Response } from "express";
import { Book } from "../models/book"



export const bookRouter = Router();





bookRouter.get('/', async (req: Request, res: Response) => {
    console.log('Fetching books from the database');
    try {
      const books = await Book.find({});
      console.log(`Found ${books.length} books`);
      res.status(200).json(books);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings' + error);
        } else {
            console.error('Error while fetching listings:', error);
            res.status(500).send('Error while fetching listings');
        }
    }
  })


  bookRouter.get('/search', async (req: Request, res: Response) => {
    const {title} = req.query; // get the title from the query
    console.log('Fetching books from the database');
    if (title === undefined || title === '' || typeof title !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const books = await Book.find({title: {$regex: title, $options: 'i'}});
            console.log(`Found ${books.length} books`);
            if (books.length === 0) {
                res.status(404).send('Book not found');
                return;
            }
            res.status(200).json(books);
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

  bookRouter.post('/addBook', async (req: Request, res: Response) => {
    try {
        const {title, genre, rental_duration} = req.body;
      const book = new Book({
        title,
        genre,
        rental_duration
      });
  
      const savedBook = await book.save();
  
      console.log('Book added successfully');
      res.status(201).json({
        message: `${savedBook.title} Book added successfully`,
        book: savedBook
      });
    } catch (error) {
      console.error('Error while adding genre:', error);
      res.status(500).send('Error while adding genre' + error);
    }});