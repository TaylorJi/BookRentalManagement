import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

// Create a transport for sending emails (replace with your email service's data)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  host:  process.env.EMAIL_HOST,
    port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your password
  },
}); 




// Set email options
const mailOptions = {
    to: 'taylor.ji719@gmail.com', // Recipient
    subject: 'Test Email', // Email subject
    html: '<p>Email Content</p>'
    // Email HTML content
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 