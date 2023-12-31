import mongoose from "mongoose";

const healthPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique:true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sessDiscount: {
    type: Number,
    required: true,
  },
  medDiscount: {
    type: Number,
    required: true,
  },
  subDiscount: {
    type: Number,
    required: true,
  },
});

const HealthPackageModel = mongoose.model("HealthPackage", healthPackageSchema);
export default HealthPackageModel;
