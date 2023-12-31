import mongoose from "mongoose";

const FamMemberSchema = new mongoose.Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    nationalID: {
      type: String,
      unique: false
      //required: true,
    },
    age: {
      type: Number,

    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    relation: {
      type: String,
      enum: ["wife", "husband", "child"],
      required: true,
    },
    healthPackageSub: {
      type: String,
      required: false
    },
    DateOfSubscribtion: {
      type: Date,
      required: false
    },
    subscriptionStatus: {
      type: String,
      enum: ["cancelled with end date", "subscribed with renewal date", "unsubscribed"],
    },
    linkageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      default: null
    },
  },
);

const FamilyMemberModel = mongoose.model("FamilyMember", FamMemberSchema);
export default FamilyMemberModel;
