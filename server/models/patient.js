import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
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
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    emergencyName: {
      type: String,
      required: true,
    },
    emergencyNo: {
      type: String,
      required: true,
    },
    emergencyRel: {
      type: String,
      required: true,
    },
    adresses: {
      type: [String],
    },
    cart: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        default: [],
      },
    ],
    wallet: {
      type: Number,
      default: 2000,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      required: true,
      default: "Accepted"
    },
    health_records: {
      records: [
        {
          description: { type: String },
          image: { type: String },
          date: { type: Date }
        }
      ]
    },
    healthPackageSub: {
      type: String,
      default: ""
    },
    DateOfSubscribtion: {
      type: Date,
      required: false
    },
    notifications:
      [
        {
          title: { type: String, enum: ["Reserved", "Cancelled", "Reschaduled"] },
          data: { type: String },
          state: {
            type: String,
            enum: ["Unread", "read"]
          }
        }
      ]
    ,
    subscriptionStatus: {
      type: String,
      enum: ["cancelled with end date", "subscribed with renewal date", "unsubscribed"],
    },
  },
  { timestamps: true }
);

const PatientModel = mongoose.model("Patient", patientSchema);
export default PatientModel;
