import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["filled", "unfilled"],
    default: "unfilled"
  },
  medicine: [
    {
      name: { type: String, required: true },
      dose: { type: String, required: true, default: 1 },
      notes: { type: String }
    }
  ],
  date: {
    type: Date,
    required: true,
  }
});

const PrescriptionModel = mongoose.model("Prescription", prescriptionSchema);
export default PrescriptionModel;
