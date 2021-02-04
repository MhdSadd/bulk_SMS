const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  message_body: {
    type: String,
    required: true
  },
},{timestamps:true});

module.exports = {Messages: mongoose.model("message", messageSchema)};
