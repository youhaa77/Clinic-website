import mongoose from "mongoose";
import MessageModel from '../models/message.js';

// To try with postman and check that it is working correctly 
const createMessage = async (req, res) => {
    try {
      const { senderId, receiverId, content } = req.body;
  
      const newMessage = new MessageModel({
        sender: senderId,
        receiver: receiverId,
        content,
      });
  
      const savedMessage = await newMessage.save();
  
      res.json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
const getMessages = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      const senderTypeId = new mongoose.Types.ObjectId(senderId);
      const receiverTypeId = new mongoose.Types.ObjectId(receiverId);
      const messages = await MessageModel.find({
        $or: [
          { sender: senderTypeId, receiver: receiverTypeId },
          { sender: receiverTypeId, receiver: senderTypeId }
        ]
      }).sort({ timestamp: 1 });

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === senderId,
          message: msg.content,
        };
      });
      res.json(projectedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export default {
    getMessages, createMessage
  };