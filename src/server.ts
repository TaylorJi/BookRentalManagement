import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose, {Schema, Document} from 'mongoose';
import { Book } from './models/book'; // ts style import
import { Genre } from './models/genre'; // ts syle import


dotenv.config();
const app = express();
app.use(express.json()); // store the result in req.body

const port = process.env.PORT || 3000;

const dbUri: string = process.env.MONGODB_URI ?? (function(): never { throw new Error('DB_URI is not defined in the environment variables'); })();

mongoose.connect(dbUri)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));




  app.get('/api/genres', async (req: Request, res: Response) => {
    console.log('Fetching genres from the database');
    try {
      const genres = await Genre.find({});
      console.log(`Found ${genres.length} genres`);
      res.status(200).json(genres);
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

  app.get('/api/books', async (req: Request, res: Response) => {
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


  app.get('/api/books/search', async (req: Request, res: Response) => {
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

  app.post('/api/addBook', async (req: Request, res: Response) => {
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

  
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});