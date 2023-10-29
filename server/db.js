
const  mongoose=require("mongoose")

 const connection =mongoose.connect(`mongodb+srv://prabhat:${process.env.pass}@cluster0.nob5hjt.mongodb.net/email_schedule?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

  module.exports={
    connection
  }