import mailer from "nodemailer";
import UserModel from '../models/user.js';
import DocModel from '../models/doctor.js';
import PatientModel from '../models/patient.js';
import DoctorModel from "../models/doctor.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name },process.env.SECRET , {
        expiresIn: maxAge
    });
};

const compare = async (req, res, next) => {
    try{
    const username=req.body.name;
    const PIN=req.body.PIN;
    const user =await UserModel.findOne({username:username,PIN:PIN})
        console.log(user);
    if(user){
        
        const token = createToken(username);
        const type=user.type;
        console.log(token)
        return res.status(201).json({token:token,type:type})
    }
    else{
        return res.status(400).json("wrong");   
    }
    }catch(err){
        return res.status(500).json("wrong");
    }


}


const forget = async (req, res, next) => {
 

    const rand = Math.floor((Math.random() * 9000) + 1000);
    let email=null;
    const username=req.body.name;
    const user1=await UserModel.findOne({username:username})
    if(!user1){
        return res.status(400).json("Wrong username")
    }
    const patient=await PatientModel.findOne({user:user1._id})
    const doctor=await DoctorModel.findOne({user:user1._id})
    if(patient){
        email=patient.email;
        user1.PIN=rand;
        user1.save();
    }
    else if(doctor){
        email=doctor.email;
        user1.PIN=rand;
        user1.save();
    }
    else{
        //return res.status(400).json("Wrong username")
        email="elhamygeorge@gmail.com";
        user1.PIN=rand;
        user1.save();
    }
    
    
    let config={
        service : "gmail",
        auth :{
            user:process.env.mail,
            pass:process.env.appPss

        },
        tls: {
            rejectUnauthorized: false
        },
    }
    
    let transporter=mailer.createTransport(config);

    let message = {
        from: process.env.mail, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `your verification code is ${rand}` // plain text body
        //html: "<b>your verification code is 5555</b>", // html body
      }

      transporter.sendMail(message).then((info) => {
        return res.status(201)
        .json({ 
            msg: "you should receive an email",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({ error })
        
    })
}




export default {
 forget,compare
  }