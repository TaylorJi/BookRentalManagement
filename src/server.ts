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




// interface IListing extends Document {
//     maximum_nights: string;
//     // add other properties as needed
//   }
  
// const listingSchema: Schema = new mongoose.Schema({
//     maximum_nights: { type: String }
//   });
  
// const Listing = mongoose.model<IListing>('Listing', listingSchema, 'listingsAndReviews');
  
// app.get('/api/test', async (req: Request, res: Response) => {
//     try {
//       const listings = await Listing.find({ maximum_nights: "30" });
//       console.log('Listings fetched successfully');
//       console.log(listings.length);
  
//       res.json(listings);
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
      res.json(genre);
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