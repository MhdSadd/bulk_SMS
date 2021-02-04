
// const MONGO_URI = "mongodb+srv://nacademy:nacademy@nacademy.q8mg9.mongodb.net/nAcademy?retryWrites=true&w=majority";
const {Admin} = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


// connecting to MongoDB with
mongoose
  .connect('mongodb+srv://reminder:reminder@reminder.nmvtt.mongodb.net/ReminderApp?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB CONNECTED SUCCESSFULLY:::`);
  })
  .catch((err) => {
    console.log(err);
  });

const admin = new Admin({
  full_name: "SHEIDU Bashir",
  email: "remiderapp@gmail.com",
  phone: 08068640710,
  password: "123abc",
  user_type: "Admin",
  avatar: "/images/avatarProfilePic.png"
});

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(admin.password, salt, (err, hash) => {
    if (err) {
      
      throw err;
    }
    admin.password = hash;
    admin
      .save()
      .then(() => {
        console.log(admin)
        console.log("admin save successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
