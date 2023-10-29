// models/Email.js
const mongoose = require('mongoose');

const emailSchema =  mongoose.Schema({
  email: String,
  scheduledTime: Date,
  subject: String,
  body: String,
  status: String, // 'Scheduled', 'Sent', 'Failed', etc.
});

const EmailModel=mongoose.model('Email', emailSchema);
module.exports = {
    EmailModel
}
