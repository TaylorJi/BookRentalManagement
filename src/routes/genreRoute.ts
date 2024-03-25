import { Router } from "express";
import { Request, Response } from "express";
import { Genre } from "../models/genre"



export const genreRouter = Router();





genreRouter.get('/', async (req: Request, res: Response) => {
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
  })


  genreRouter.get('/search', async (req: Request, res: Response) => {
    const {genre} = req.query; // get the title from the query
    console.log('Fetching genres from the database');
    if (genre === undefined || genre === '' || typeof genre !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const genres = await Genre.find({genre: {$regex: genre, $options: 'i'}});
            console.log(`Found ${genres.length} genres`);
            if (genres.length === 0) {
                res.status(404).send('Book not found');
                return;
            }
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

  genreRouter.post('/', async (req: Request, res: Response) => {
    try {
        const {genre} = req.body;
      const newGenre = new Genre({
        genre,
      });
  
      const genreToAdd = await newGenre.save();
  
      console.log('Book added successfully');
      res.status(201).json({
        message: `${genreToAdd.genre } Book added successfully`,
        genre: genreToAdd
      });
    } catch (error) {
      console.error('Error while adding genre:', error);
      res.status(500).send('Error while adding genre' + error);
    }});