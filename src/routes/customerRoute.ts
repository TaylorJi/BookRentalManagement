import { Router } from "express";
import { Request, Response } from "express";
import { Customer } from "../models/customer"



export const customerRouter = Router();


// get all customers
customerRouter.get('/', async (req: Request, res: Response) => {
    console.log('Fetching books from the database');
    try {
      const customers = await Customer.find({});
      console.log(`Found ${customers.length} books`);
      res.status(200).json(customers);
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

    // search by name
  customerRouter.get('/search', async (req: Request, res: Response) => {
    const {name} = req.query; // get the title from the query
    console.log('Fetching books from the database');
    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid title');
        return;
        }
        try {
            const customers = await Customer.find({name: {$regex: name, $options: 'i'}});
            console.log(`Found ${customers.length} books`);
            if (customers.length === 0) {
                res.status(404).send('Customer not found');
                return;
            }
            res.status(200).json(customers);
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

  // add a customer
  customerRouter.post('/', async (req: Request, res: Response) => {
    try {
        const {name, contact, address, note, late_fee} = req.body;
      const customer = new Customer({
        name,
        contact,
        address,
        note,
        late_fee
      
      });
  
      const customerToAdd = await customer.save();
  
      console.log('Customer has been added successfully');
      res.status(201).json({
        message: `${customerToAdd.name} has been added successfully`,
        customer: customerToAdd
      });
    } catch (error) {
      console.error('Error while adding genre:', error);
      res.status(500).send('Error while adding genre' + error);
    }});

    // update a customer
    customerRouter.put('/update/:id', async (req: Request, res: Response) => {
        try {
            const {name, contact, address, note, late_fee} = req.body;
            const {id} = req.params;
            const customer = await Customer.findByIdAndUpdate(id, {name, contact, address, note, late_fee}, {new: true});
    
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                });
            }
    
            console.log(`${customer.name} has been updated successfully`);
            res.status(200).json({
                message: `${customer.name} has been updated successfully`,
                customer
            });
        } catch (error) {
            console.error('Error while updating customer:', error);
            res.status(500).send('Error while updating customer' + error);
        }
    });


    // delete a customer
    customerRouter.delete('/:id', async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            await Customer.findByIdAndDelete(id);
            console.log('Customer has been deleted successfully');
            res.status(200).json({
                message: 'Customer has been deleted successfully'
            }); // send an empty object
            
        } catch (error) {
            console.error('Error while deleting customer:', error);
            res.status(500).send('Error while deleting customer' + error);
        }
    });