const nodemailer = require("nodemailer");
require('dotenv').config('./../.env')


const sendEmail = async (mailObj)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465, 
            auth: {
                user: process.env.SMTPUSERNAME,
                pass: process.env.SMTPPASSWORD
            },
        });
   
        transporter.sendMail({ ...mailObj, from: '"Sartia Global" <mritunjay.jobs@gmail.com>' }, (err, info) => {
          if (err) {
            resolve({ success: false, data: err })
          } else {
            resolve({ success: true, data: info })
          }
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmail
}