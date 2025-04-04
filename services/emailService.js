const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail=async(reciever,subject,body)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reciever,
        subject: subject,
        text: body
    });
}

module.exports=sendEmail;