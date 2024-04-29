import { Router } from "express";
import { Request, Response } from "express";
import { Type } from "../models/type"



export const typeRouter = Router();


typeRouter.get('/', async (req: Request, res: Response) => {
    console.log('Fetching types from the database');
    try {
      const types = await Type.find({});
      console.log(`Found ${types.length} types`);
      res.status(200).json(types);
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


  // search by type 
  typeRouter.get('/search', async (req: Request, res: Response) => {
    const {type} = req.query; // get the title from the query
    console.log('Fetching types from the database');
    if (type === undefined || type === '' || typeof type !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const types = await Type.find({type: {$regex: type, $options: 'i'}});
            console.log(`Found ${types.length} types`);
            if (types.length === 0) {
                res.status(404).send('Book not found');
                return;
            }
            res.status(200).json(types);
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


  // search by id
    typeRouter.get('/id', async (req: Request, res: Response) => {
        const {id} = req.query; // get the title from the query
        console.log('Fetching types from the database');
        if (id === undefined || id === '' || typeof id !== 'string') {
            res.status(400).send('Invalid title');
            return;
            }
            try {
                const types = await Type.findById(id);
                if (types === null) {
                    res.status(404).send('Book not found');
                    return;
                }
                res.status(200).json(types);
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

  // add a type
  typeRouter.post('/', async (req: Request, res: Response) => {
    try {
        const {name, fee, duration, late_fee} = req.body;
      const newtype = new Type({
        name,
        fee,
        duration,
        late_fee
      });
  
      const typeToAdd = await newtype.save();
  
      console.log('Book added successfully');
      res.status(201).json({
        message: `${typeToAdd.name } added successfully`,
        type: typeToAdd
      });
    } catch (error) {
      console.error('Error while adding type:', error);
      res.status(500).send('Error while adding type' + error);
    }});

    // update a type
    typeRouter.put('/:id', async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const {name, fee, duration} = req.body;
            const typeToUpdate = await Type.findByIdAndUpdate(id, {name, fee, duration}, {new: true});
            console.log('type updated successfully');
            res.status(200).json({
                message: 'type updated successfully',
                type: typeToUpdate
            });
        } catch (error) {
            console.error('Error while updating type:', error);
            res.status(500).send('Error while updating type' + error);
        }
    });

    // delete a type
    typeRouter.delete('/:id', async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            await Type.findByIdAndDelete(id);
            console.log('type deleted successfully');
            res.status(200).json({
                message: 'type deleted successfully'
            });
        } catch (error) {
            console.error('Error while deleting type:', error);
            res.status(500).send('Error while deleting type' + error);
        }
    });