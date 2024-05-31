// reminderScheduler.ts
import cron from 'node-cron';
import moment from 'moment-timezone';
import {BookRent} from '../models/bookRent'
import {Customer} from '../models/customer';
import { sendEmail } from './sendEmail';

const checkDueDatesAndOverdues = async (): Promise<void> => {
    try {
      const today = moment().startOf('day');
      const threeDaysLater = today.clone().add(3, 'days').format('YYYY-MM-DD');
      const yesterday = today.clone().subtract(1, 'days').format('YYYY-MM-DD');
  
      // Find book rents with due date 3 days from now
      const dueSoonRents = await BookRent.find({ 'borrowed_books.return_date': threeDaysLater }).exec();
  
      for (const rent of dueSoonRents) {
        const customer = await Customer.findById(rent.customer_ID).exec();
        if (customer) {
          await sendEmail(
            customer.email,
            'Due Date Reminder',
            'due_date_reminder',
            {
              customerName: customer.name,
              books: rent.borrowed_books,
              dueDate: threeDaysLater,
              companyName: 'Todays Book',
              year: new Date().getFullYear(),
            }
          );
        }
      }
  
      // Find book rents with due date yesterday
      const overdueRents = await BookRent.find({ 'borrowed_books.return_date': { $lte: yesterday } }).exec();
  
      for (const rent of overdueRents) {
        const customer = await Customer.findById(rent.customer_ID).exec();
        if (customer) {
          await sendEmail(
            customer.email,
            'Overdue Notice',
            'overdue_notice',
            {
              customerName: customer.name,
              books: rent.borrowed_books,
              dueDate: yesterday,
              companyName: 'Todays Book',
              year: new Date().getFullYear(),
            }
          );
        }
      }
    } catch (error) {
      console.error('Error checking due dates and overdues:', error);
    }
  };
  
  // Schedule the checkDueDatesAndOverdues function to run daily
  cron.schedule('0 0 * * *', checkDueDatesAndOverdues); // Runs every day at midnight
  
  // To start the scheduler immediately for testing purposes
  checkDueDatesAndOverdues();
  
