const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  courses: [
    { title: {
        type: String,
      },
      courseType: {
        type: String,
      
      },
      url: {
        type: String,
      },
      platform: {
        type: String,
      } 
    }]

});

const User = mongoose.model("User", UserSchema);

module.exports = User;