import nodemailer from 'nodemailer';

// Create a transport for sending emails (replace with your email service's data)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  host: 'smtp.gmail.com',
    port: 587,
  auth: {
    user: 'taylor.ji719@gmail.com', // Your email address
    pass: 'hblkrtksnlqetsrf', // Your password
  },
}); 




// Set email options
const mailOptions = {
    from: 'taylor.sangwoo.ji@gmail.com', // Sender
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