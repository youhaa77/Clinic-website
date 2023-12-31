import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,

  },
  password: {
    type: String,
    required: true,
  },
  PIN: {
    type: Number
  },
  type: {
    type: String,
    enum: ['Patient', 'Admin', 'Doctor', 'Pharmacist'],
    required: true,
  },
  socket: {
    type: String
  },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
