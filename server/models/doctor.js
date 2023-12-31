import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  eduBackground: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "PendingContract", "Accepted", "Rejected"],
    required: true,
    default: "Pending",
  },
  //sss
  speciality: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: [Date],
    default: [],
  },
  wallet: {
    type: Number,
    default: 0,
  },
  notifications: 
       [
        {
          title: { type: String,enum: ["Reserved","Cancelled", "Reschaduled"] },
          data: { type: String },
          state: { type: String,
            enum: ["Unread", "read"] }
        }
      ],
  //sss
  idFile: {
    type: String,
    //required: true,
  },
  degreeFile: {
    type: String,
    //required: true,
  },
  licenseFile: {
    type: String,
    //required: true,
  },
});

const DoctorModel = mongoose.model("Doctor", doctorSchema);
export default DoctorModel;
