var nodemailer = require('nodemailer')
    , auth = require('../config/auth')




var mailer = module.exports = function(username, email, title, msgContent) { //username and other parameters not used at moment still testing
    console.log(username, email, title, msgContent)
    // create reusable transporter object using SMTP transport
   // var transporter = nodemailer.createTransport({
   //      service: 'gmail',
   //      auth: {
   //          user: 'markogrady18@gmail.com',
   //          pass: auth.email
   //      }
   //  });

   //  transporter.sendMail({
   //      from: 'markogrady18@gmail.com',
   //      to: 'markogrady18@gmail.com',
   //      subject: 'hello',
   //      text: 'hello world!'
   //  });
}


