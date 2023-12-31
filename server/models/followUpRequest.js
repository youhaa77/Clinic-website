import mongoose from "mongoose";

const FollowUpRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      required: false,
    },
    status: {
      type: String,
      enum: ["upcoming", "Accepted", "Revoked"],
      default: "upcoming",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  }
);

const FollowUpRequestModel = mongoose.model("FollowUpRequest", FollowUpRequestSchema);
export default FollowUpRequestModel;
