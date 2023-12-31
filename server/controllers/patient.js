import PatientModel from '../models/patient.js';
import UserModel from '../models/user.js';
import PresModel from '../models/prescription.js';
import HealthPackageModel from '../models/healthPackage.js';
import FollowUpRequestModel from '../models/followUpRequest.js';
import DocModel from '../models/doctor.js';
import AppointmentModel from '../models/appointment.js';
import MedicineModel from '../models/medicine.js';
import bcrypt from "bcrypt";
const saltRounds = 10;

const createPatient = async (req, res) => {
  const {
    username,
    name,
    type,
    email,
    password,
    birthDate,
    gender,
    phone,
    emergencyName,
    emergencyNo,
    emergencyRel,
    adresses,
    status,
    wallet,
    health_records,
  } = req.body;

  try {
    // Check if password is provided
    if (!password || password.trim() === '') {
      return res.status(400).json({ message: 'Please fill in the password.' });
    }
    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Please fill in the username.' });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password is invalid' });
    }

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      if (!name ||
        !email ||
        !birthDate ||
        !gender ||
        !phone ||
        !emergencyName ||
        !emergencyNo ||
        !emergencyRel ||
        !adresses 
       ) {
          return res.status(400).json({ error: "Complete all fields" });
        }
      try {
        const user = new UserModel({ username, password, type });
        user.password = hashedPassword;
        console.log(user.password);
        console.log(req.body);

        await user.save();
        console.log(user);
        const patient = new PatientModel({
          user: user._id,
          name,
          email,
          birthDate,
          gender,
          phone,
          emergencyName,
          emergencyNo,
          emergencyRel,
          adresses,
          status,
          wallet,
          health_records
        });
        await patient.save();
        console.log(patient);
        res.status(200).json(patient);
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
      }
    } else {
      return res.status(400).json({ message: "Username already exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find();
    console.log(patients);
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const getNotfication = async (req, res) => {
  try {
    console.log("wslnaa");
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    res.status(200).json(patient.notifications);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};
const sawNotfication = async (req, res) => {
  try {
    console.log("wslnaa saww");
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    for (let i = 0; i < patient.notifications.length; i++) {
      patient.notifications[i].state = "read"
    }
    await patient.save()
    res.status(200).json(patient.notifications);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const getMyPatients = async (req, res) => {
  //retrieve patients that have an appointmen wth this dr from the database
  const doc = await DocModel.findOne({ user: res.locals.userId })
  const doctorId = doc._id;
  console.log(req.query.id);
  const myPatients = [];
  try {
    const drAppointments = await AppointmentModel.find({ doctorId: doctorId });
    const patients = []
    for (const appointment1 of drAppointments) {

      let arrayOfPatient = await PatientModel.find({ _id: appointment1.patientId });
      let patient = arrayOfPatient[0];

      if (patients.length === 0)
        patients.push(patient);
      else {
        let found = false;
        for (let i = 0; i < patients.length; i++) {
          if ((patients[i]._id).equals(patient._id)) {
            found = true;
            break;
          }
        }
        if (!found) {
          patients.push(patient);
        }
      }

    }
    console.log(patients);
    // res.status(200).json(patients);
    const rows = patients.map((object) => {
      return {
        _id: object._id,
        name: object.name,
        email: object.email,
        birthDate: object.birthDate,
        gender: object.gender,
        phone: object.phone,
        emergencyName: object.emergencyName,
        emergencyNo: object.emergencyNo,
        emergencyRel: object.emergencyRel
      };
    });
    console.log(rows);
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};
const getPatientHealthPackage = async (req, res) => {
  try {
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    if (!patient) return res.status(404).send("patient not found");
    if (patient.healthPackageSub) {
      const hp = await HealthPackageModel.find({ name: patient.healthPackageSub });
      return res.status(200).send(hp);
    }
    res.status(200).send(null);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
const getPatientByName = async (req, res) => {
  const { doctorId, patientName } = req.body;
  console.log(req.body);
  try {

    const drAppointments = await AppointmentModel.find({ doctorId: doctorId });
    const patients = []
    for (const appointment1 of drAppointments) {

      let arrayOfPatient = await PatientModel.find({ _id: appointment1.patientId });
      let patient = arrayOfPatient[0];

      if (patients.length === 0)
        patients.push(patient);
      else {
        let found = false;
        for (let i = 0; i < patients.length; i++) {
          if ((patients[i]._id).equals(patient._id)) {
            found = true;
            break;
          }
        }
        if (!found) {
          patients.push(patient);
        }
      }

    }
    const patientsOfReqName = patients.filter(object => object.name.toLowerCase() === patientName.toLowerCase());
    if (patientsOfReqName.length === 0) {
      console.log("no patients with this name!");
      res.status(200).json("no patients with this name!")
    }
    else {
      const patientsReqDetails = patientsOfReqName.map((object) => {
        return {
          name: object.name,
          email: object.email,
          birthDate: object.birthDate,
          gender: object.gender,
          phone: object.phone,
          emergencyName: object.emergencyName,
          emergencyNo: object.emergencyNo,
          emergencyRel: object.emergencyRel
        };
      });
      console.log(patientsReqDetails);
      res.status(200).json(patientsReqDetails)
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};
const upcomingApp = async (req, res) => {
  try {
    const doc = await DocModel.findOne({ user: res.locals.userId });
    const doctorId = doc._id;

    const drAppointments = await AppointmentModel.find({
      doctorId: doctorId,
      status: "upcoming", // Only fetch upcoming appointments
    }).populate("patientId"); // Populate the patientId field to get patient details

    // Create a map to keep track of unique patients based on patientId
    const uniquePatientsMap = new Map();

    drAppointments.forEach((appointment) => {
      const patientId = appointment.patientId._id.toString();

      if (!uniquePatientsMap.has(patientId)) {
        uniquePatientsMap.set(patientId, {
          _id: appointment.patientId._id,
          name: appointment.patientId.name,
          email: appointment.patientId.email,
          birthDate: appointment.patientId.birthDate,
          gender: appointment.patientId.gender,
          phone: appointment.patientId.phone,
          emergencyName: appointment.patientId.emergencyName,
          emergencyNo: appointment.patientId.emergencyNo,
          emergencyRel: appointment.patientId.emergencyRel,
          date: appointment.date,
        });
      }
    });

    const uniquePatients = [...uniquePatientsMap.values()];

    res.status(200).json(uniquePatients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getPrescriptions = async (req, res) => {
  try {
    console.log(req.query)
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient._id;
    const arr = await PresModel.find({ "patientId": patientID }).populate('doctorId');
    console.log(arr);
    res.status(200).json(arr);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};
//searching by the name of the doctor take care of the is it oring or anding
const filterPres = async (req, res) => {
  try {
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const doctorName = req.body.doctorName;
    const doctor = await DocModel.findOne({ name: doctorName })
    const date = req.body.date;
    console.log(doctor);
    const state = req.body.state;
    const patientId = patient._id;
    if (doctor !== null) {
      const arr = await PresModel.find({
        $or: [
          { doctorId: doctor._id }
        ], patientId: patientId
      }).populate('doctorId')
      res.status(200).json(arr);
    }
    else {
      const arr = await PresModel.find({
        $or: [
          { date: date },
          { status: state }
        ], patientId: patientId
      }).populate('doctorId')
      res.status(200).json(arr);
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

// const PayAppointmentByWallet = async (req, res) => {
//   try {
//     const patientID = req.body.id;
//     const discount = await getSessDiscount(patientID);
//     const sessionPrice = 200;
//     const discountedAmount = (discount / 100) * sessionPrice;
//     const patient = await PatientModel.findById(patientID);
//     if (!patient) {
//       throw new Error('Patient not found');
//     }
//     patient.wallet -= discountedAmount;
//     await patient.save();

//     res.status(200).send({ "discount": discount, "deductedAmount": discountedAmount });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// }

const getPres = async (req, res) => {
  try {
    const presID = req.params.id
    const perscription = await PresModel.findById(presID)
    res.status(200).json(perscription);
  } catch {
    res.status(400).json({ error: error.message })
  }

}

const getSessDiscount = async (req, res) => {
  try {
    //const patientID = req.params.id;
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient._id;
    const subscribtion = patient.healthPackageSub;
    var discount = 0;
    if (subscribtion !== null && subscribtion !== "" && subscribtion !== " ") {
      const HealthPack = await HealthPackageModel.findOne({ "name": subscribtion });
      discount = HealthPack.sessDiscount;
    }
    res.status(200).send({ "discount": discount });
  } catch (e) {
    res.status(400).send(e);
  }
}


const updateWallet = async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    console.log(patient);
    patient.wallet += paymentAmount;
    const updatedPatient = await patient.save();
    res.status(200).json({ updatedWallet: updatedPatient.wallet });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

import FamilyMemberModel from "../models/familyMember.js"

// req.params -->  current user ID
//req.body --> email , relation 
const linkPatient = async (req, res) => {

  try {
    const mailORnumber = req.body.input;
    let patient1 = "";
    var number = Number(mailORnumber);
    if (!isNaN(number)) {
      //Input is a number
      patient1 = await PatientModel.findOne({ "phone": number });
    } else {
      //Input is an email
      patient1 = await PatientModel.findOne({ "email": mailORnumber });
    }
    if (patient1 === null) { res.status(200).send("incorrect email or number , patient not found"); return; }

    console.log(patient1);
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient._id;
    const rel = req.body.relation;
    //const patient1 = await PatientModel.findOne({"email": mail });
    const age = (new Date()).getFullYear() - patient1.birthDate.getFullYear() + 1;
    const newFamMember = new FamilyMemberModel({ "patientID": patientID, "name": patient1.name, "age": age, "gender": patient1.gender, "relation": rel, "linkageID": patient1._id, "healthPackageSub": "", "DateOfSubscribtion": null, "subscriptionStatus": "unsubscribed" });
    newFamMember.save();
    res.status(200).send("Added Successfully");
    console.log(newFamMember);

  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

// req.params --> current user ID
//req.body --> number , relation 
// const linkPatientByNumber= async (req, res)=>{
//   try{  
//     const no = req.body.number;
//     const patientID = req.params.patientID ;
//     const rel = req.body.relation ;
//     const patient1 = await PatientModel.findOne({"phone": no });
//     const age = (new Date()).getFullYear() - patient1.birthDate.getFullYear()+1;
//     const newFamMember = new FamilyMemberModel({"patientID":patientID, "name":patient1.name , "age":age , "gender":patient1.gender,"relation":rel,"linkageID":patient1._id });
//     await newFamMember.save();
//     //res.status(200).send(" "+ (new Date()).getFullYear() +"-"+ patient1.birthDate.getFullYear() +" = "+age);
//     res.status(200).json(newFamMember);
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//     }

// }

// NEED TO update healthpackage subsc. if it is expired (duration 1 year)
// let subDate = patient1.DateOfSubscribtion ;
//   let currentDate = new Date();
//   let differenceInTime = currentDate.getTime() - subDate.getTime();
//   let differenceInDays = differenceInTime / (1000 * 3600 * 24);

// if(differenceInDays > 365){
//     //the subscribtion has expired , remove it and display a message for the patient
// }else{

// }

//req.params --> patientID
const patientDetails = async (req, res) => {
  try {
    const patientID = req.params.patientID;
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    console.log(patient1);
    res.status(200).json(patient1);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await PatientModel.findOne({ user: res.locals.userId })
    if (!patient) return res.status(404).send("Patient not found");
    return res.status(200).send(patient);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//req.params --> id
const cancelSubscription = async (req, res) => {
  try {
    const patientID = req.params.id;
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    if (patient1.healthPackageSub === "") {
      res.status(200).send("you are not subscribed to any Health Package");
      return;
    }
    patient1.subscriptionStatus = "cancelled with end date";
    patient1.save();
    res.status(200).send("Done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const checkIfLinked = async (req, res) => {
  try {
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient1._id;
    const member1 = await FamilyMemberModel.findOne({ "linkageID": patientID });
    if (!member1) return;
    const parentID = member1.patientID;
    const parent = await PatientModel.findById(parentID);
    console.log("my parent patient that i am linked to" + parent);
    if (!parent) { console.log("wrong linkage id , no patient with this id asln"); return; };
    const hp = await HealthPackageModel.find({ "name": parent.healthPackageSub });
    if (!hp) { console.log("wrong hp name , no hp with that name"); return; };
    //console.log("hp "+hp + hp[0].subDiscount);
    res.status(200).json(hp[0].subDiscount);
  } catch (error) {
    res.status(400).send(error);
  }
}



const unsubscribe = async (req, res) => {
  try {

    const patientID = req.params.id;
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    console.log("MY CONSOLE FOR UNSUBSCRIBE FOR ME" + patient1);
    if (patient1.healthPackageSub === "") {
      res.status(200).send("you are not subscribed to any Health Package");
      return;
    }
    if (patient1.subscriptionStatus === "unsubscribed") { res.status(200).send("already unsubscribed"); return; }
    patient1.subscriptionStatus = "unsubscribed";
    patient1.healthPackageSub = "";
    patient1.DateOfSubscribtion = "";
    patient1.save();
    res.status(200).send("Done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



const getHealthRecords = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await PatientModel.findOne({ user: res.locals.userId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientRecords = patient.health_records;
    res.status(200).json(patientRecords);
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addHealthRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await PatientModel.findOne({ user: res.locals.userId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const healthRecord = {
      date: req.body.date,
      description: req.body.description,
      image: req.files[0].filename
    }
    if (!patient.health_records) {
      patient.health_records = { records: [] };
    }
    if (Array.isArray(healthRecord)) {
      patient.health_records.records.push(...healthRecord);
    } else {
      patient.health_records.records.push(healthRecord);
    }
    await patient.save();
    console.log('Patient after saving health records:', patient);
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeHealthRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await PatientModel.findOne({ user: res.locals.userId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const records = []

    if (patient.health_records && patient.health_records.records.length > 0) {
      patient.health_records.records.forEach(r => {
        if (r._id != req.body.id) {
          records.push(r)
        }
      })
    }

    patient.health_records.records = records
    await patient.save();
    console.log('Patient after saving health records:', patient);
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getWallet = async (req, res) => {
  try {
    const patientName = req.params.patientName;
    console.log(patientName);
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    console.log(patient);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientWallet = patient.wallet;
    res.status(200).json(patientWallet);
  } catch (error) {
    console.error('Error in getwallet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const myPrescriptions = async (req, res) => {
  try {
    const patientId = res.locals.userId;

    // Check if the patient exists
    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const prescriptions = await PresModel.find({ patientId: patientId });

    return res.status(200).json({ prescriptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const requestFollowUp = async (req, res) => {
  try {
    const { doctorId, familyMemberId } = req.body;

    // Check if the user is a patient
    const user = await UserModel.findOne({ _id: res.locals.userId, type: { $regex: /patient/i } });
    if (!user) {
      return res.status(401).json({ message: "You have no authorization to request follow-up" });
    }

    // Create a new follow-up request
    const followUpRequest = new FollowUpRequestModel({
      patientId: res.locals.userId,
      doctorId,
      familyMemberId,
      status: "Pending",
    });

    // Save the follow-up request
    await followUpRequest.save();

    return res.status(201).json({ message: "Follow-up request created successfully", followUpRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


import axios from "axios"
import fs from "fs";


//  require prescription id in params
const payPrescription = async (req, res) => {
  // + redirect to the cart pharmacy 
  try {
    //let TotalPrice = 0;
    // const patient = await PatientModel.findOne({ user: res.locals.userId })
    // const patientId = patient._id;
    const presID = req.params.id;
    const perscription = await PrescriptionModel.findById(presID);
    //check its presence to avoid errors
    if (!perscription) {
      res.status(200).json({ error: "no prescription with this id , check the database" });
      return;
    }
    if (perscription.status === "filled") {
      res.status(200).json({ error: "already ordered!!, can not order it twice" });
      return;
    }

    const patient = await PatientModel.findOne({ user: res.locals.userId });

    // add medicine to cart
    for (const medicine of perscription.medicine) {
      const med = await MedicineModel.findOne({ medicineName: medicine.name });
      if (med && patient.cart) {
        const isFound = patient.cart.some(item => item.medicine.equals(med._id));
        if (!isFound) {
          patient.cart.push({
            medicine: med._id,
            quantity: 1
          })
        }
      }
    }
    await patient.save();
    perscription.status = "filled";
    await perscription.save();



    res.status(200).json("now the prescription is 'filled'");
    // //get the total price of all the medicines in the pres from the pharmacy server
    // axios.get("http://localhost:9000/medicine/medicinesTotPrice",perscription.medicine).
    // then((result) => {
    //   console.log("total price from the pharmacy = "+result);
    //   TotalPrice = result;
    //   });
    // await updateWallet({ body: { patientId, TotalPrice } }, res);
    // //make an order with these medicines in the pharmacy or just add to the cart????? check with the TA 

    // res.status(200).json(TotalPrice+"  done");

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


//npm install pdfkit 
import pdfkit from 'pdfkit'
import DoctorModel from '../models/doctor.js';
import PrescriptionModel from '../models/prescription.js';
const printPresPDF = async (req, res) => {

  const id = req.params.id;
  const data = await PresModel.findById(id);
  if (!data) {
    console.error('pres not found ', error);
    return;
  }
  const patient = await PatientModel.findOne({ user: res.locals.userId });
  const doctor = await DoctorModel.findOne({ _id: data.doctorId });
  try {
    // Generate a unique filename for the PDF
    const filename = "output_prescription.pdf";

    // Generate the PDF
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream(filename));
    doc.text("Prescription: \n \n")
    doc.text("Doctor: " + doctor.name + "\n")
    doc.text("Patient: " + patient.name + "\n")
    doc.text("Date : " + data.date.toLocaleDateString(
      "en-GB",
      {}
    ) + "\n \n")
    data.medicine.forEach(function (element) {
      doc.text("medicine: " + element.name + "\n" + "dose: " + element.dose + "\n" + "notes: " + element.notes + "\n \n")
    });
    doc.end();

    // Send the generated PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    const fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Delete the file after it's streamed or on error
      fs.unlinkSync(filename);
    });

    fileStream.on('error', (err) => {
      console.error('Error streaming PDF:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}


export default {
  createPatient,
  getPatients,
  getPatientHealthPackage,
  getMyPatients,
  getPatientByName,
  upcomingApp,
  getPrescriptions,
  filterPres,
  getPres,
  updateWallet,
  getSessDiscount,
  linkPatient,
  patientDetails,
  cancelSubscription,
  unsubscribe,
  getHealthRecords,
  addHealthRecord,
  removeHealthRecord,
  getWallet,
  checkIfLinked,
  myPrescriptions,
  requestFollowUp,
  getNotfication,
  sawNotfication,
  getPatientById,
  payPrescription,
  printPresPDF
}