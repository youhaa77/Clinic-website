import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import doctorRoutes from "./routes/doctor.js";
import patientRoutes from "./routes/patient.js";
import adminRoutes from "./routes/admin.js";
import appointmentRoutes from './routes/appointment.js';
import chatRoutes from "./routes/message.js";
import stripe from 'stripe';
//import  {Server}  from "socket.io";
import doctor from './models/doctor.js'
import UserModel from './models/user.js';
import jwt from "jsonwebtoken";

import Auth from './Authentication/login.js'


const app = express();

app.use(express.json());
app.use(cors());
const stripeInstance = new stripe('sk_test_51OAbKKFG7BNY2kzIjyhX3ByBqijkVoASpjD4fcyOIjGcYiyxMdpHzQAf2rX7bBcokOGHeo7uwxDLX8mkStLJD3pj001MnvPqcn');
import http from "http";
import { Server } from "socket.io";

//const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5174",
//     methods: ["GET", "POST"], 
//   }, 
// })

//global.onlineUsers = new Map();
// io.on('connection', (socket) => {
//   console.log('A user connected');
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log(`user ${userId}is added`);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     console.log(`${data.msg} is sent from ${data.from} to ${data.to}`);
//     if (sendUserSocket) {
//       console.log(`${data.msg} is received by ${data.to}`);
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });

const port = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    const server = app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);


      const io = new Server(server, {
        cors: {
          origin: true,
          methods: ["GET", "POST"],
        },
      });

      const tokenSocketMap = {};
      global.onlineUsers = new Map();

      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }

      io.on("connection", (socket) => {
        global.chatSocket = socket;
        var room = null;
        const token = socket.handshake.query.room;


        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
          if (!err) {
            room = decodedToken.name;

          }
        });

        socket.join(room);
        tokenSocketMap[room] = socket.id;
        console.log(tokenSocketMap);

        //socket.emit("me", socket.id);
        io.to(socket.id).emit("me", socket.id);

        socket.on("disconnect", () => {
          socket.broadcast.emit("callEnded")
        })
        socket.on("left", () => {
          console.log("5errr");
          socket.broadcast.emit("callEnded")
        })

        socket.on("callUser", async (data) => {
          //     const fofa= await doctor.find();
          console.log("yarbb " + data.userToCall)

          var fromm = null;


          jwt.verify(data.fromTok, process.env.SECRET, async (err, decodedToken) => {
            if (err) {

              // console.log('You are not logged in.');
              // res send status 401 you are not logged in
              console.log("yyyah ya wad ya t2eel")
              // res.redirect('/login');
            } else {
              fromm = decodedToken.name;
              // console.log("ya m5albiiiii "+tokenSocketMap[fromm]);

            }
          });

          const room = await UserModel.findById(data.userToCall);
          console.log("chelsee  " + room)




          io.to(room.username).emit("callUser", { signal: data.signalData, from: tokenSocketMap[fromm], name: fromm })

          //    io.to(fofa).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
        })

        socket.on("answerCall", (data) => {

          var room = getKeyByValue(tokenSocketMap, data.to);
          console.log("Ansewr------" + room);
          io.to(room).emit("callAccepted", data.signal)
        })

        global.chatSocket = socket;
        socket.on("add-user", (userId) => {
          onlineUsers.set(userId, socket.id);
          console.log(`user ${userId}is added`);
        });

        socket.on("send-msg", (data) => {
          const sendUserSocket = onlineUsers.get(data.to);
          console.log(`${data.msg} is sent from ${data.from} to ${data.to}`);
          if (sendUserSocket) {
            console.log(`${data.msg} is received by ${data.to}`);
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
          }
        });
      })
    });


  })
  .catch((err) => console.log(err));



// images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory where your images are located
const imagesDirectory = path.join(__dirname, './uploads');

// Set up a route to serve images
app.use('/images', express.static(imagesDirectory));

// routes
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
app.use("/admin", adminRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/chat", chatRoutes);
app.post("/login", Auth.login)
// This is your test secret API key.



const YOUR_DOMAIN = 'http://localhost:5173/patientFamilyAppointments/';

const storeItems = new Map([
  [1, { price: 200, name: 'Dr. hamada session' }], [2, { price: 200, name: 'Dr. hamada session' }]
])

app.post('/AppointmentCheckout', async (req, res) => {
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: 'price_1OAhcrFG7BNY2kzIxPQqkTZi', // Replace with the actual Price ID from your Stripe Dashboard
        quantity: 4
      },
    ],
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

const PACKAGE_DOMAIN = 'http://localhost:5173/PatientHP_FM/';

app.post('/PackageCheckout', async (req, res) => {
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: 'price_1OAhcrFG7BNY2kzIxPQqkTZi', // Replace with the actual Price ID from your Stripe Dashboard
        quantity: 1
      },
    ],
    success_url: `${PACKAGE_DOMAIN}?success=true`,
    cancel_url: `${PACKAGE_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.listen(4243, () => console.log('Running on port 4243'));