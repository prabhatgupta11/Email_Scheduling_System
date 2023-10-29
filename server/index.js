
const express=require("express")
const { connection } = require("mongoose")
require("dotenv").config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const {EmailModel} = require('./model/emailModel'); // Import the Email schema

// Middleware
const app=express()
app.use(express.json())
app.use(bodyParser.json());
//database connection

mongoose.connect(`mongodb+srv://prabhat:${process.env.pas}@cluster0.nob5hjt.mongodb.net/Email_scheduling?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

// routes

// Schedule an email
app.post('/schedule-email', async (req, res) => {
    try {

      if (!req.body.email || !req.body.scheduledTime || !req.body.subject || !req.body.body) {
        return res.status(400).json({ error: 'Invalid request' });
      }
  
      // Create an email document
      const email = new EmailModel({
        email: req.body.email,
        scheduledTime: new Date(req.body.scheduledTime),
        subject: req.body.subject,
        body: req.body.body,
        status: 'Scheduled',
      });
     

      await email.save();
     
      // Schedule email delivery using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // E.g., 'Gmail', 'Yahoo', etc.
    auth: {
      user: 'guptajim3636@gmail.com',
      pass: process.env.passs,  
    },
  });
  
  // Function to send the scheduled email
  const sendEmail = (email) => {
    console.log(88,email)
    const mailOptions = {
      from: 'guptajim3636@gmail.com',
      to: email.email,
      subject: email.subject,
      text: email.body,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email delivery failed:', error);
        email.status = 'Failed'; // Update email status to 'Failed'
      } else {
        console.log('Email delivered:', info.response);
        email.status = 'Sent'; // Update email status to 'Sent'
      }
  
      // Save the updated status to the database
      email.save();
    });
  };
  
  // For example, you can use setInterval to check for emails to send every minute
  // setInterval(async () => {
   
    const now = new Date();
    const emails = await EmailModel.find({ status: 'Scheduled', scheduledTime: { $lte: now } });
    emails.forEach(sendEmail);
  // }, 1000); // Check every minute
  
  
      res.json({ message: 'Email scheduled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Track email status
  app.get('/email-status', async (req, res) => {
    try {
      const emails = await EmailModel.find();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving email status' });
    }
  });

app.listen(process.env.PORT, () => {
  console.log("Server is running at port 4500");
});
