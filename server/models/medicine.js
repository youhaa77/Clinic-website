import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    medicineStatus: {
      type: String,
      enum: ["Available", "Unavailable"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sales: {
      type: Number,
      required: true,
      default: 0,
    },
    medicinalUse: {
      type: String,
      required: true,
    },
    archiveStatus: {
      type: String,
      enum: ["Archived", "Unarchived"],
      default: "Unarchived",
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MedicineModel = mongoose.model("Medicine", medicineSchema);
export default MedicineModel;
