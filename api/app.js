
// packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

// local imports
const userModel = require("./models/user");

// app instantiation
const app = express();

// for parsing json, based on body-parser
app.use(express.json());

// cors
app.use(cors({
  // origin of client here...
  // origin: '*'
}));

// for hashing password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// routes
// NOTE: All routes send status code 500 if error (500 means server encountered unexpected error)


app.get('/', (req, res) => {
  res.json({"response": "Welcome to the MyCourse Api!"});
})

// POST request for creating user profile
// req body should have username and password
app.post('/addUser', async function(req, res){

  // console.log(req.body);
  
  //Encrypt user password
    let encryptedUserPassword = await bcrypt.hash(req.body.password, 10);

    // Create user in our database
    const user = new userModel({
      username: req.body.username,
      password: encryptedUserPassword,
    });

  try {
    
    // check if username exists
    let doesUsernameExist = await userModel
      .findOne({ username: req.body.username })
      .exec();

    // if user exists this will not execute, (to avoid duplicates)
    if (!doesUsernameExist && req.body.password) {
      await user.save();
      res.json({"status": 200, "message": "Success. User profile added."})
    } else {
      res.json({"status": 400, "message": "Error. Username already exists."});
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})

// POST request for logging user in (requesting user info with username and password)
// req body should have username and password
app.post('/login', async function(req, res){

  // console.log(req.body);

  try {

    // check if username exists
    // work with hashed password here
    let user = await userModel
      .findOne({ username: req.body.username })
      .exec();

    // if user exists this will not execute, (to avoid duplicates)
    if (user && bcrypt.compare(req.body.password, user.password)) {
      // user info, if successful login/authentication
      res.json({"status": 200, username: user.username, _id: user._id, courses: user.courses})
    } else {
      res.json({"status": 400, "message": "Error. Incorrect username or password."});
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})

// POST request here to get courses after user has been authenticated
app.post('/getCourses', async (req, res) => {

  try {
    
    let user = await userModel
      .findOne({ username: req.body.username })
      .exec();

      res.json({"status": 200, "courses": user.courses })
    
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})

// PUT request here to add course object to courses array
//  req body should have username, and course to be added (see user.courses in user data model)
app.put('/addCourse', async (req, res) => {

  // console.log(req.body)

  try{

    let user = await userModel
      .findOne({ username: req.body.username })
      .exec();
    
    if (user && req.body.title && req.body.url) {

      await user.updateOne({ $push: {courses: {title:               
      req.body.title, courseType: req.body.courseType, url:       req.body.url, platform: req.body.platform}} })

      user = await userModel
      .findOne({ username: req.body.username })
      .exec();
      
      res.json({"status": 200, "message": "Success. Course was added to user profile.", "courses": user.courses })
    } else {
      res.json({"status": 400, "message": "Error. The request body did not match required format."});
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})

// PUT request here to remove course object from courses array
// the req body should include username and courses array with one object that has _id of the course to be deleted (courses._id)
app.put('/deleteCourse', async (req, res) => {

  // console.log(req.body)

  try{

    let user = await userModel
      .findOne({ username: req.body.username })
      .exec();

    
    if (user && req.body.courseID) {

      await user.updateOne( { $pull: { courses: { _id: req.body.courseID }} })

      // check here to verify course was removed before sending confirmation message?
      
      res.json({"status": 200, "message": "Success. Course was removed from user profile."})
    } else {
      res.json({"status": 400, "message": "Some error occurred."});
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})

// PUT request to delete user profile from database
// req body should include _id of user profile and username
app.put('/deleteUser', async (req, res) => {

  // console.log(req.body)
  
  try{

    // delete profile
    await userModel
      .findOneAndDelete({ _id: req.body._id })
      .exec();

    // Check if delete attempt was successful or if profile still exists 
    let user = await userModel.findOne({username: req.body.username})

    // response based on whether profile was successfully deleted or not
    if (req.body.username && req.body._id && !user) {
      
     res.json({"status": 200, "message": "Success. Profile was deleted."});
    } else {
      res.json({"status": 400, "message": "Error, profile not deleted."});
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
})


module.exports = app;