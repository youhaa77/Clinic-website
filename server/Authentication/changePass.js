import UserModel from '../models/user.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;

const changePass = async (req, res, next) => {
    
    const newPass=req.body.password;
    console.log(req);
    console.log("lolll "+newPass);
    const authHeader=req.headers['authorization'];
    const token =authHeader && (authHeader.split(' ')[1])
    console.log("lolllosss "+token);
    if (token) {
        
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
         if (err) {
             
           // console.log('You are not logged in.');
           // res send status 401 you are not logged in
           res.status(401).json({message:"You have no authorization"})
           // res.redirect('/login');
         } else {
             const name=decodedToken.name;
             const user=await UserModel.findOne({username:name})
             if(user){
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(newPass, salt);
                 user.password=hashedPassword;
                 user.save();
                 return res.status(200).json({message:"successfully changed"})
             }
             else{
                 res.status(401).json({message:"You have no authorization"})
             }
              
         }
       });
     } else {
       res.status(401).json({message:"You have no authorization"})
     }
}




export default {
    changePass
   }