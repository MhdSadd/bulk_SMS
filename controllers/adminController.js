const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport")
const {Admin} = require("../models/admin");
const {User} = require("../models/user")
const credentials = require('../config/configurations').credentials
  // Africa's Talking init
const AT = require("africastalking")(credentials);
  //initialize AT's SMS service
const sms = AT.SMS;


module.exports = {

loginGet: (req, res)=>{
  let pageTitle = "Login"
  res.render('admin/login', {pageTitle})
},


loginPost: (req, res, next)=>{
  // console.log(req.body)
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
},


dashboard: async(req, res)=>{
  let pageTitle = "Dashboard"
  let name = req.user.full_name;
  let email = req.user.email
  res.render('admin/dashboard', {pageTitle, name, email})
},


users_table: async(req, res)=>{
  let pageTitle = "Users"
  const users = await User.find()
  const user_count = await User.countDocuments()
  let name = req.user.full_name;
  let email = req.user.email;
  res.render('admin/users', {pageTitle, name, email, users, user_count})
},

reminder_page: async(req, res)=>{
  let pageTitle = "Reminder"
  let name = req.user.full_name;
  let email = req.user.email;
  res.render('admin/message', {pageTitle, name, email})
},


reminder_post: async(req, res)=>{
  // console.log('body====>',req.body.message_body)
 User.find({}, {_id: 0, user_name: 0, house_address: 0, createdAt: 0, updatedAt: 0, __v: 0 }).then((users)=>{
   let phones = users.map((item)=>{
     return item.phone_number
   })

   async function sendMessage() {
    let recievers = phones
    const {subject, message_body} = req.body
    let message = `${req.body.subject.toUpperCase()} 
    ${req.body.message_body}`
    console.log(message)  
      // console.log('phones====',recievers)
    const options = {
        // Set the numbers you want to send to in international format
        to: recievers,
        // Set your message
        message: message,
        // Set your shortCode or senderId
      }

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options)
        .then(req.flash(
          'success_msg','Reminders sent successfully'))
        .catch(req.flash(
          'error_msg','Sending failed'));
    }
    sendMessage()
    res.redirect('/admin/message')

 })
},












   // LOGOUT HANDLER 
   logout: (req, res) => {
    req.logOut();
    req.flash('success_msg', "You are logged out");
    res.redirect("/admin/login");
},

}