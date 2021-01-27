const mongoose = require("mongoose");

//create a user schema
//js object that represents how a user object will be formatted in db
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
  }, {
    timestamps: true,
  });
  
  //mongoose model
  //collection is named User
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
