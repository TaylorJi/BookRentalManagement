import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { loadTemplate } from './emailTemplates';

dotenv.config();

// Create a transport for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, templateName: string, templateData: object): Promise<void> => {
  try {
    const html = await loadTemplate(templateName, templateData);
    const mailOptions = {
      to,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending failed:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error loading template:', error);
  }
};

// // Example usage
// sendEmail(
//   'taylor.ji719@gmail.com', // send to
//   'Rental Confirmation', // subject
//   'rental_confirmation', // template name
//   { 
//     customerName: 'Taylor',
//      bookTitle: '1984', 
//      author: 'George Orwell', 
//      rentalDate: '2024-05-01', 
//      dueDate: '2024-06-01',
//     year: new Date().getFullYear()}
// );


export { sendEmail };