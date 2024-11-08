const { transporter } = require("./email.config");
const { Verification_Email_Template, Welcome_Email_Template } = require("./emailtemplate");


const sendverificationcode=async(email,verificationcode)=>{
    try{
        const response = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            text: "passcode is send", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationcode), // html body
          });
          console.log("Email Send successfully",response)
    }catch(error){
        console.log("Email error",error)
    }
}

const Welcomeemail=async(email,username)=>{
    try{
        const response = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome to the Blog Website", // plain text body
            html: Welcome_Email_Template.replace("{username}",username), // html body
          });
          console.log("Email Send successfully",response)
    }catch(error){
        console.log("Email error",error)
    }
}

module.exports={sendverificationcode,Welcomeemail}