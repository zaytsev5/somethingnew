const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const mysql = require('mysql')
const app = express();

app.use(bodyParser.json())

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
//GET POSTES ON TRIP ON DATE(ID)
router.get('/:trip/:id', (req, res) =>{
  let query = 'SELECT * FROM postes,details_postes WHERE postes.dateMove ="'+req.params.trip+'" and postes.postID = details_postes.postID and tripID = "'+req.params.id+'"'
  mysqlDB.query(query,(err,postes)=>{
    if(err) throw err;
    res.json(postes)
  })
  }  
);
router.get('/booking-ticket', (req, res) => {

  res.render('booking')
});

router.get('/profile/',ensureAuthenticated, (req, res) =>{

	res.render('changename',{
    user:req.user
  });
  }
	 
);
router.get('/users', async (req, res) =>{
    // try{
    //   const users = await User.find();
    //   res.json(users)
    // }catch(err){
    //   res.json({message:err})
    // }
    User.find().then((users)=>{
       res.json(users)
    }).catch((err)=>{
      res.json(err)
    })
  }
);
router.get('/home',(req,res) => {
  res.render('home')
})
router.get('/mua-ve-saigon-dalat',(req,res) => {

  res.render('saigon-dalat',{
    user:req.user
  })
})
router.get('/mua-ve-dalat-saigon',(req,res) => {
  res.render('dalat-saigon')
})

// 
module.exports = router;
// const btns = document.querySelectorAll('button');
// btns.forEach((btn) =>{
//   btn.addEventListener('click',(e)=>{
//     console.log(e.target.textContent)
//   });
// });

// CHON NGAY DI 
// CHON NOI DI 
// CHON GIO DI 

// 1 NGAY DO CO CHUYEN DI KHONG - SO CHUYEN XE DI -> COUNT = 0 TRA VE KHONG CO CHUYEN XE NGAY HOM DO -> GET DUOC TRIPID
// 2 NEU COUNT > 0 -< DUYET THEM BANG DETAILS DUNG TRIPID -> XE NAO -> GET DC SO XE DI NGAY HOM DO