const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const emailExistence = require('email-existence')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express();



// Load User model
const User = require('../models/User');
const UserMysql = require('../models/UserMysql');

// Middleware
const { ensureAuthenticated,forwardAuthenticated } = require('../config/auth');
require('../config/passport')(passport);
// Login Page

// Register Page
router.get('/account', forwardAuthenticated, (req, res) => res.render('register',{title:"ticketMe| Tài khoản"}));

router.get('/me',ensureAuthenticated, (req,res) =>{

  res.render('account',{
    user: req.user
  })
})

router.get('/reset',forwardAuthenticated,(req,res) =>{
  res.render('reserpass');
})

router.post('/me/pass',async (req,res) =>{
console.log(req.body)
  if(req.body.new =="" || req.body.new.length < 6){
     req.flash(
                'error_msg',
                'Có lỗi! Thu lai mat khau moi'
              );
            return   res.redirect('/user/me');
  }
  if(req.body.old == req.user.password ){
    console.log(req.user.email)
    User.updateOne({'email' : req.user.email},{$set: { 'password' : req.body.new}},(err,result)=>{
      if(err) return console.log(err)
         req.flash(
                'success_msg',
                'Đổi mật khẩu thành công'
              )
        return res.redirect('/user/me');
    });
    
  }
  else {
    console.log("Sai mat khau")
     req.flash(
                'error_msg',
                'Có lỗi! Sai mat khau'
              );
            return   res.redirect('/user/me');
  }

})
// HANDLE EMAIL RESET 
router.post('/email',async (req,res) =>{
  console.log(req.body.email)
  User.findOne({email:req.body.email}).then( user =>{
    if(!user){
      console.log("khong cos")
      return res.send({status:false})
    }
      const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>From: ticketMe</li>
          <li>Email: shinminah357159@gmail.com</li>
          <li>Phone: 0333157628</li>
          <li><strong>Secret:</strong>${req.body.check}</li>

        </ul>
        `;

  // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'shinminah357159@gmail.com', // generated ethereal user
            pass: '01649254108'  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });

  // setup email data with unicode symbols
      let mailOptions = {
          from: '"Freelancer.com" <shinminah357159@email.com>', // sender address
          to: req.body.email, // list of receivers
          subject: 'BookYourBus', // Subject line
          text: 'Hello world?', // plain text body
          html: output // html body
      };

  // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return res.send({status:false})
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          console.log('Sent!')
          res.send({status:true})
      });
  // console.log(req.body.email)
  });

  
})

router.post('/confirm',async (req,res) =>{
  console.log(req.body.email)
    User.updateOne({'email' : req.body.email},{$set: { 'password' : req.body.password}},(err,result)=>{
        if(err) return res.send({isChanged:false})
            console.log("done")
            
        return res.send({isChanged:true})
    });
    
  
})

//HANDLE REQUEST PASSWORD NEW


// HANDLE CHANGE EMAIL 
router.post('/me/email', (req,res) =>{
  emailExistence.check(req.body.email, function(error, response){
    if(response){
      console.log(response)
      User.findOne({email:req.body.email}).then(user =>{
         if(user){
          req.flash(
                    'error_msg',
                    'Có lỗi! Email đã đăng kí'
                  );
                return   res.redirect('/user/me');
         }
         else{
              if(req.body.password == req.user.password ){

                  User.updateOne({'email' : req.user.email},{$set: { 'email' : req.body.email}},(err,result)=>{
                    if(err) return console.log(err)
                      console.log("done")
                      
                    return res.redirect('/user/logout');
                  });
        
               }
              else {
                console.log("Sai mat khau")
                 req.flash(
                            'error_msg',
                            'Có lỗi! Sai mat khau'
                          );
                        return   res.redirect('/user/me');
              }

         }
      })

      
    }else{
      req.flash(
                    'error_msg',
                    'Có lỗi! Email khong ton tai'
                  );
                return   res.redirect('/user/me');
    }
  })
  
})
// Register handler
router.post('/account/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  const role = "user";
  let errors = [];
  let cash = 0;

  if (!name || !email || !password || !password2) {
     req.flash(
                'error_msg',
                'Có lỗi! Không được bỏ trống'
              );
            return   res.redirect('/user/account#dangki');
  }

  if (password != password2) {
     req.flash(
                'error_msg',
                'Có lỗi! Mật khẩu không trùng nhau'
              );
           return   res.redirect('/user/account#dangki');
  }

  if (password.length < 6) {
     req.flash(
                'error_msg',
                'Mật khẩu phải ít nhất 6 kí tự'
              );
           return    res.redirect('/user/account#dangki');

  }
    console.log(email)
     emailExistence.check(email, function(error, response){
        if(error) return console.log(error)
          console.log(response)
        if(response){
          User.findOne({ email: email }).then(user => {
            if (user) {
              req.flash(
                'error_msg',
                'Có lỗi! Email đã được đăng kí '
              );
              res.redirect('/user/account#dangki');
            } else {
              const newUser = new User({
                name,
                email,
                password,
                role,
                cash

              });

              bcrypt.genSalt(10, (err, salt) => {
                // bcrypt.hash(newUser.password, salt, (err, hash) => {
                //   if (err) throw err;
                //   newUser.password = hash;
                //   newUser
                //     .save()
                //     .then(user => {
                //       req.flash(
                //         'success_msg',
                //         'Bây giờ, bạn có thể đăng nhập'
                //       );
                //       res.redirect('/user/account#dangnhap');
                //     })
                //     .catch(err => console.log(err));
                // });
                newUser
                    .save()
                    .then(user => {
                      req.flash(
                        'success_msg',
                        'Bây giờ, bạn có thể đăng nhập'
                      );
                      res.redirect('/user/account#dangnhap');
                    })
                    .catch(err => console.log(err));
              });
            }
          });
        }else{
           req.flash(
              'error_msg',
              'Có lỗi! Email này không tồn tại'
              );
            res.redirect('/user/account#dangki');
        }
    });
   
  
});

// Login handler
router.post('/account/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/user/account#dangnhap',
    failureFlash: true
  })(req, res, next);
});

// Logout handler
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/account#dangnhap');
});

module.exports = router;


