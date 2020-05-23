const paypal = require('paypal-rest-sdk')
const nodemailer = require('nodemailer')


module.exports = {
  doPayment: async function(response,request){
      const create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:5000/success",
              "cancel_url": "http://localhost:5000/cancel"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": "Red Sox Hat",
                      "sku": "001",
                      "price": "25.00",
                      "currency": "USD",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "USD",
                  "total": "25.00"
              },
              "description": 'Red tiger hat for devs'
          }]
      };

      paypal.payment.create(create_payment_json,async function (error, payment) {

        if (error) {
            throw error;
        } else {
          console.log("insds")
            for(let k = 0;k < payment.links.length;k++){
              if(payment.links[k].rel === 'approval_url'){
                 console.log(payment.links[k].href)
                  return response.send({link:payment.links[k].href})
                // response.redirect(payment.links[i].href);
              }
            }
            console.log("hrere")
        }
      });
},
sendMailToCus: function (response,request){
  const output = `
        <p>You have a new contact requestuest</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>From: ticketMe</li>
          <li>Email: shinminah357159@gmail.com</li>
          <li>Phone: 0333157628</li>
          <li><strong>Secret:</strong>sdfdsfs</li>

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
          from: '"Freelancer.com" <shinminah357159@email.com>', // sender addresponses
          to: 'n17dccn041@student.ptithcm.edu.vn', // list of receivers
          subject: 'BookYourBus', // Subject line
          text: 'Hello world?', // plain text body
          html: output // html body
      };

  // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return response.send({status:false})
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          console.log('Sent!')
          // response.send({status:true})
      });
}

};

