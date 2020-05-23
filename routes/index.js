const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const router = express.Router();
const paypal = require('paypal-rest-sdk')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const UserMysql = require('../models/UserMysql');
const {doPayment, sendMailToCus} = require('../config/payment');
const Ticket = require('../models/Ticket')
const nodemailer = require('nodemailer')
const app = express();
// Variables for email
let tickets = [];
let dateBook ="ádad";
let postID ="ádsad";
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWgYYDvYvC35qGNvoTs8QDLUZdl8kmaOISELHK1lAA6GcEhjMc5eCR-c54eOVOLOuNyWQE7fpkoD5w_w',
  'client_secret': 'EDvXzdrHt_E6fWCdiE5ifE27TceUXVCcea9_iO3jl0u4XlFRiFYcrz1Lo6uXaLKKVZ0zOKGh9HfjQdc1'
});

app.use(express.json)
app.use(bodyParser.json())


router.get('/', forwardAuthenticated, (req, res) => res.redirect('home'));

router.get('/trips',(req,res) =>{
  res.render('trips',{
    user: req.user
  });
})

router.get('/booking/tickets',(req,res) =>{
  res.render('ticketinfo');
})

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/test', (req, res) =>{
  let TinhTrang = true;
  let MaVeXe="1234"
  let CMND="1214214124"
  let STK= "12323432";
 const ticketCancle = new Ticket({MaVeXe,CMND,STK,TinhTrang});
 ticketCancle.save().then(user =>{
    if(user) return res.send({is:true})
      res.send({is:false})
 })
  
});

router.post('/customer/insert',async (req, res) =>{
  // const {CMND,TenKH,Email,SDT,GioiTinh,DiaChi} = req.body;
  if(req.body){
    const {CMND,TenKH,Email,SDT,GioiTinh,DiaChi,SLGhe,Dongia,NgayDat,MaCX} = req.body; 
    console.log(MaCX)
    let bind = [];
    bind.push(CMND) 
    bind.push(TenKH) 
    bind.push(Email) 
    bind.push(SDT) 
    bind.push(GioiTinh) 
    bind.push(DiaChi) 
    console.log(SLGhe.length)
    let next = true;
    let unique = new Date().getTime()
 const find = await  UserMysql.findCusById(CMND, async (result)=>{
      if(result.length > 0){
         console.log("exist")
      } else{
          UserMysql.save(bind,(result)=>{
          if(!result) {
            next = false;
            // return res.status(204).send({status:false})
          }
        })
      }
      if(next){
        console.log("in")
       
        for(let i = 0 ;i < SLGhe.length ; i++){
          console.log(i)
           bind = []
          bind.push((unique-i).toString());
          bind.push(MaCX);
          bind.push(SLGhe[i]);
          bind.push(Dongia);

           UserMysql.saveDetailTicket(bind,(result)=>{
            if(result){
              bind= [];
              bind.push('C' +(unique-i).toString() )
              bind.push((unique-i).toString())
              bind.push(CMND)
              bind.push(NgayDat);

               UserMysql.saveTicket(bind,(result)=>{
                if(result){
                  UserMysql.updateTickets(1,MaCX,(result)=>{
                      if(result) {
                        tickets.push((unique-i).toString());
                        console.log("updated")
                        if(i == SLGhe.length - 1){
                          doPayment(res,req);
                        }
                      }
                        else res.status(204).send({status:false})
                   })
                }
                else res.status(204).send({status:false})

              })
            }else{
              return  res.send({status:false})

            }

          })
        }
  /// THANH TOAN

       // return res.status(200).send({status:true})
       
      }else{
        return  res.status(204).send({status:false})
      }
      
    })
  
    // UserMysql.save(bind,(result) =>{
    //   // if(result) return res.status(201).send({status:true})
    //   if(result){
      // if(next){
      //   console.log("in")
      //   bind = []
      //   for(let i = 0 ;i < SLGhe.length ; i++){
      //     bind.push("1257");
      //     bind.push("P002");
      //     bind.push(SLGhe[i]);
      //     bind.push(Dongia);

      //     UserMysql.saveDetailTicket(bind,(result)=>{
      //       if(result){
      //         bind= [];
      //         bind.push("12571")
      //         bind.push("1257")
      //         bind.push(CMND)
      //         bind.push(NgayDat);

      //         UserMysql.saveTicket(bind,(result)=>{
      //           if(result) return res.status(201).send({status:true})
      //           else res.status(204).send({status:false})

      //         })
      //       }else{
      //         return  res.status(204).send({status:false})

      //       }

      //     })
      //   }
      // }else{
      //   return  res.status(204).send({status:false})
      // }
        
    //   }else 
    //   return  res.status(204).send({status:false})
    // })
    

  }else{
   return res.send({status:false})
  }
});

router.get('/customer/id', (req,res) =>{
  UserMysql.getAllCusId((ids)=>{
    if(ids) return res.status(200).json(ids)
    console.log("err")
  })
})

router.get('/booking/ticket/:ticketId', (req,res) =>{
  console.log("toi day roi")
  UserMysql.checkTicket(req.params.ticketId,(result)=>{
    if(result) return res.status(200).json(result)
    console.log("err")
  })
})


router.get('/admin/trips',ensureAuthenticated,(req,res) =>{
  UserMysql.getAllTrips((trips)=>{
    res.json(trips)
  })
})

router.get('/post/:trip/:date', (req, res) =>{
  UserMysql.findPost(req.params.trip,req.params.date,(post)=>{
   res.json(post)

  })
});

router.get('/time/:trip/:date', (req, res) =>{
  UserMysql.getTimePost(req.params.trip,req.params.date,(post)=>{
   res.json(post)
  })
});

router.get('/post/:trip/:date/:time', (req, res) =>{
  UserMysql.findPostTime(
    req.params.trip,
    req.params.date,
    req.params.time,(post)=>{
   res.json(post)

  })
});

router.get('/trip',(req,res) =>{
  UserMysql.findTrip((post)=>{
   res.status(200).json(post)

  })
})


router.get('/booking-ticket', (req, res) => {
  const id = req.query.deleteId;
  if(id) {
    UserMysql.deletePost(id,(result)=>{
     if(result)  return console.log("done")
    })
    return res.redirect('/booking-ticket')
  }
 
  res.render('booking',{
    title:"nguyen"
  })
});

router.get('/posts', (req, res) => {
  let id = req.params.id;
  // UserMysql.findById(id,function(result){
  //   if(result) res.json(result);
  // })
  UserMysql.getPosts((result) =>{
    res.json(result)
  })
});

router.get('/checkseat/:postId',(req, res) =>{
  UserMysql.findSeat(req.params.postId,(result) =>{
      res.status(200).send(result)
  })
})


router.get('/account/profile/',ensureAuthenticated, (req, res) =>{
	 // User.findById(req.params.id, function(err, user) {
  //    	res.render('changename',{
  //    		username:user
  //    	});
  //   });
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
   if(req.query.d){
    console.log(req.query.d);
  }
  res.render('home',{
    user:req.user
  })
})

router.get('/mua-ve-saigon-kiengiang',(req,res) => {
  var userInfo = {
    CMND:'',
    TenKH:'',
    Email:'',
    STD:'',
    GioiTinh:'',
    DiaChi:''
  };
  if(req.user)
  UserMysql.getInfoUser(req.user.email,(user)=>{
    if(user.length > 0){
      userInfo.CMND = user[0].CMND;
      userInfo.TenKH = user[0].TenKH;
      userInfo.Email = user[0].Email;
      userInfo.SDT = user[0].SDT;
      userInfo.GioiTinh = user[0].GioiTinh;
      userInfo.DiaChi = user[0].DiaChi;
      res.render('saigon-kiengiang',{
        user:req.user,
        userInfo:userInfo 
      })
    }else
      res.render('saigon-kiengiang',{
        user:req.user
      })

  })
else  res.render('saigon-kiengiang',{
        user:req.user
      })
  
})

router.get('/mua-ve-dalat-saigon',(req,res) => {
  res.render('dalat-saigon')
})
router.get('/success',async  (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json,async  function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        const sendmail = await sendMailToCus();
        res.render('verified');
    }
});
});


module.exports = router;
