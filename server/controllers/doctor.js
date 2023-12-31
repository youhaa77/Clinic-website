import DoctorModel from '../models/doctor.js';
import UserModel from '../models/user.js';
import AppointmentModel from '../models/appointment.js';
import prescriptionModel from '../models/prescription.js';
import PatientModel from '../models/patient.js';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import FollowUpRequestModel from '../models/followUpRequest.js';
import e from 'express';
import PrescriptionModel from '../models/prescription.js';
import axios from "axios"
const saltRounds = 10;

const createDoctor = async (req, res) => {
  const {
    username,
    name,
    email,
    type,
    password,
    birthDate,
    hourlyRate,
    hospital,
    eduBackground,
    status,
    wallet,
    //sss
    speciality,
    availableSlots,
    //sss
  } = req.body;
  let files = {}
  req.files.forEach(file => {
    if (file.fieldname == "idFile") {
      files = { ...files, idFile: file.filename }
    } else if (file.fieldname == "degreeFile") {
      files = { ...files, degreeFile: file.filename }
    } else if (file.fieldname == "licenseFile") {
      files = { ...files, licenseFile: file.filename }
    }
  });
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   console.log(password)
    //   return res.status(400).json({ message: 'Password is invalid' });
    // }

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      try {
        const user = new UserModel({ username, password, type });
        user.password = hashedPassword;
        console.log(user.password);
        await user.save();
        console.log(user);
        const doctor = new DoctorModel({
          user: user._id,
          name,
          email,
          birthDate,
          hourlyRate,
          hospital,
          eduBackground,
          status,
          wallet,
          //sss
          speciality,
          availableSlots,
          //sss
          ...files
        });
        await doctor.save();
        console.log(doctor);
        res.status(200).json(doctor);
      } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(400).json("Username already exist");
    }
  } catch (error) {
    console.log("error")
    res.status(400).json({ error: error.message });
  }
};

const getNotfication = async (req, res) => {
  try {
    console.log("wslnaa");
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    res.status(200).json(doctor.notifications);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};
const sawNotfication = async (req, res) => {
  try {
    console.log("wslnaa saww");
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    for (let i = 0; i < doctor.notifications.length; i++) {
      doctor.notifications[i].state = "read"
    }
    await doctor.save()
    res.status(200).json(doctor.notifications);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const getDoctors = async (req, res) => {
  try {
    const user = await DoctorModel.find();
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};


const getDoctorByIdForChat = async (req, res) => {
  try {
    const pharmacist = await DoctorModel.findOne(
      { user: res.locals.userId }
    );
    if (!pharmacist) return res.status(404).send("Pharmacist not found");
    res.status(200).send(pharmacist);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const getDoctorById = async (req, res) => {

  console.log(req.params.id)
  try {
    const doctor = await DoctorModel.findById(
      new mongoose.Types.ObjectId(req.params.id)
    );
    if (!doctor) return res.status(404).send("Doctor not found");
    res.status(200).send(doctor);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const acceptDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(
      req.params.id,
      { status: 'PendingContract' },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const rejectDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).send(error.message);
  }

}

const getContract = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).send(error.message);
  }

}

const acceptDoctorContract = async (req, res) => {
  try {
    const doc = await DoctorModel.findOne({ user: res.locals.userId });
    const doctor = await DoctorModel.findByIdAndUpdate(
      doc._id,
      { status: 'Accepted' },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//sss
const getAllDoctors = async (req, res) => {
  console.log("wslnaa hnaa")
  // console.log(res.locals.userId)
  const pat = await PatientModel.findOne({ user: res.locals.userId });
  console.log(pat);
  try {
    const doctor = await DoctorModel.find({ status: "Accepted" });
    console.log(doctor);
    res.status(200).json(doctor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAcceptedDoctors = async (req, res) => {
  try {
    const user = await DoctorModel.find({ status: "Accepted" });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const searchByNameOrSpec = async (req, res) => {
  const body = req.body;
  //console.log(req.body);
  try {
    if (body.name) {
      const doctors = await DoctorModel.aggregate([
        {
          $project: {
            ['name']: 1,
            // ['_id']: 0,
            // ['email']: 1,
            // ['hospital']: 1,
            ['speciality']: 1,
          },
        }
      ]);
      const filteredArray = doctors.filter(object => object.name === body.name);
      //console.log("if part");
      //console.log(filteredArray);
      res.status(200).json(filteredArray)
    } else if (body.speciality) {
      const { speciality } = req.body;
      const doctors = await DoctorModel.aggregate([
        {
          $project: {
            ['name']: 1,
            // ['_id']: 0,
            // ['email']: 1,
            // ['hospital']: 1,
            ['speciality']: 1,
          },
        }
      ]);
      const filteredArray = doctors.filter(object => object.speciality === speciality);
      //console.log("else if part");
      //console.log(filteredArray);
      res.status(200).json(filteredArray)
    } else {
      const { name } = req.body;
      const { speciality } = req.body;
      const doctors = await DoctorModel.aggregate([
        {
          $project: {
            ['name']: 1,
            ['_id']: 0,
            // ['email']: 1,
            // ['hospital']: 1,
            ['speciality']: 1,
          },
        }
      ]);
      const filteredArray1 = doctors.filter(object => object.name === name);
      const filteredArray = filteredArray1.filter(object => object.speciality === speciality)
      //console.log(filteredArray);
      //console.log("else part");
      res.status(200).json(filteredArray)
    }

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const filterBySpecOrAv = async (req, res) => {

  try {
    // Filter by speciality
    console.log(req.body)
    const { searchTime, searchSpec } = req.body;

    const searchTimeDate = new Date(searchTime)
    searchTimeDate.setHours(searchTimeDate.getHours() + 3);
    console.log(searchTimeDate)

    if (searchTime && searchSpec) {
      const filtered = await DoctorModel.find({ speciality: searchSpec, availableSlots: { $in: [searchTimeDate] } });
      res.status(200).json(filtered);
    }
    else if (searchSpec) {
      const filtered = await DoctorModel.find({ speciality: searchSpec })
      res.status(200).json(filtered);

    }
    else if (searchTime) {
      console.log("soso----" + searchTime)
      const filtered = await DoctorModel.find({ availableSlots: { $in: [searchTimeDate] } });
      console.log(filtered)
      res.status(200).json(filtered);
    }
    else {
      const filtered = await DoctorModel.find({ status: "Accepted" });
      res.status(200).json(filtered);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//=======
//handled in front end if somthing is not filledreturn previous thing
const updateDoctor = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const rate = req.body.hourlyRate;
    const hospital = req.body.hospital.trim();
    //temp until get it from session
    const doctorID = req.body.doctorID;
    const doctor = await DoctorModel.findOne({ user: res.locals.userId })
    if (email && email !== "" && email.includes("@")) {
      doctor.email = email;
    }
    if (hospital && hospital !== "") {
      doctor.hospital = hospital;
    }
    if (rate && rate > 0) {
      doctor.hourlyRate = rate;
    }
    await doctor.save();
    res.status(200).json(doctor);
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getHealthRecord = async (req, res) => {
  try {
    const doc = await DoctorModel.findOne({ user: res.locals.userId })
    const doctorID = doc._id;
    const patientID = req.body.patientID;
    console.log("doc" + doc);
    const appointment = await AppointmentModel.findOne({ doctorId: doctorID, patientId: patientID })
    console.log("appointments" + appointment)

    if (appointment && appointment.patientId) {
      // Extract patient ID from the appointment
      const patient = appointment.patientId;

      console.log("patient ID:", patient._id);

      // Fetch health records for the patient
      const healthRecords = await PatientModel.findById(patient._id).select('health_records.records');

      console.log("healthRecords:", healthRecords);

      res.status(200).json(healthRecords);
    } else {
      res.status(400).json({ error: "No appointment found for the specified doctor and patient." });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};
const addAvailableTimeSlots = async (req, res) => {
  try {
    const doc = await DoctorModel.findOne({ user: res.locals.userId })
    const doctorId = doc._id;
    console.log('Doctor ID:', doctorId);
    const doctor = await DoctorModel.findOne({ _id: doctorId });
    console.log('Doctor:', doctor);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (doctor.status !== 'Accepted') {
      return res.status(403).json({ error: 'Doctor is not accepted yet' });
    }
    console.log('Doctor status:', doctor.status);

    const { availableSlots } = req.body;
    console.log('Date:', availableSlots);
    if (!doctor.availableSlots) {
      doctor.availableSlots = [];
    }

    // Ensure availableSlots is an array
    const slotsArray = Array.isArray(availableSlots) ? availableSlots : [availableSlots];
    for (const slot of slotsArray) {
      const date1 = new Date(slot);
      console.log("date1" + date1)
      for (const drSlot of doctor.availableSlots) {
        const date2 = new Date(drSlot);
        console.log("date2" + date2)
        if (date1.getTime() === date2.getTime()) {
          return res.status(500).json({ error: 'Date already exists in available slots' });
        }
      }
    }
    doctor.availableSlots.push(...slotsArray);
    console.log("slotsArray" + slotsArray);
    await doctor.save();
    res.status(200).json(doctor);
    console.log('Doctor after saving:', doctor);
  } catch (error) {
    console.error("Error in addAvailableTimeSlots:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const addHealthRecords = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const patientId = req.body.patientId;
    console.log('Doctor ID:', doctorId);
    console.log('Patient ID:', patientId);
    const doctor = await DoctorModel.findOne({ user: res.locals.userId })
    if (!doctor || doctor.status !== 'Accepted') {
      return res.status(403).json({ error: 'Doctor not found or not accepted by the admin' });
    }
    const patient = await PatientModel.findOne({ _id: patientId });
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
const getWallet = async (req, res) => {
  try {
    const doctorName = req.params.doctorName;
    console.log(doctorName);
    await DoctorModel.findOne({ user: res.locals.userId })
    const doctor = await DoctorModel.findOne({ user: res.locals.userId })
    console.log(doctor);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctorWallet = doctor.wallet;
    res.status(200).json(doctorWallet);
  } catch (error) {
    console.error('Error in getwallet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateAppointment = async (req, res) => {
  try {
    const { appointmentId, newType } = req.body;
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!appointmentId || !newType) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Check if the doctor is allowed to change appointment type
    const appointment = await AppointmentModel.findOne({
      _id: appointmentId
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }



    if (appointment.type === "regular" && newType === "follow up") {
      appointment.type = newType;
      await appointment.save();
      return res.status(200).json(appointment);
    } else {
      return res.status(400).json({ error: "Invalid type change request" });
    }
  } catch (error) {
    console.error("Error in changeAppointmentType:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updatecompletedAppointment = async (req, res) => {
  try {
    const { appointmentId, newStatus } = req.body;
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!appointmentId || !newStatus) {
      return res.status(400).json({ error: "Invalid input" });
    }


    const appointment = await AppointmentModel.findOne({
      _id: appointmentId
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }



    if (appointment.status === "upcoming") {
      appointment.status = newStatus;
      await appointment.save();
      return res.status(200).json(appointment);
    } else {
      return res.status(400).json({ error: "Invalid type change request" });
    }
  } catch (error) {
    console.error("Error in changeAppointmentType:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updatecancelledAppointment = async (req, res) => {
  try {
    const { appointmentId, newStatus } = req.body;
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!appointmentId || !newStatus) {
      return res.status(400).json({ error: "Invalid input" });
    }


    const appointment = await AppointmentModel.findOne({
      _id: appointmentId
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }



    if (appointment.status === "upcoming") {
      appointment.status = newStatus;
      await appointment.save();
      return res.status(200).json(appointment);
    } else {
      return res.status(400).json({ error: "Invalid type change request" });
    }
  } catch (error) {
    console.error("Error in updatecompletedAppointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, state, name, dose, date } = req.body;


    const patient = await PatientModel.findById(patientId);
    const doctor = await DoctorModel.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ error: "Patient or Doctor not found" });
    }

    // Create a new prescription
    const newPrescription = new prescriptionModel({
      patientId: patientId,
      doctorId: doctorId,
      state: state,
      medicine: [
        {
          name: name,
          dose: dose
        }
      ],
      date: date,
    });

    // Save the prescription
    await newPrescription.save();

    return res.status(201).json({ message: "Prescription added successfully", prescription: newPrescription });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const myPrescriptions = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const prescriptions = await PrescriptionModel.find({ doctorId: doctor._id });

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleFollowUpRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    // Check if the user is a doctor
    const user = await UserModel.findOne({ _id: res.locals.userId, type: { $regex: /doctor/i } });
    if (!user) {
      return res.status(401).json({ message: "You have no authorization to handle follow-up requests" });
    }

    // Check if the action is valid
    if (!["Accept", "Revoke"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Update the follow-up request status
    const updatedRequest = await FollowUpRequestModel.findByIdAndUpdate(
      requestId,
      { status: action === "Accept" ? "Accepted" : "Revoked" },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Follow-up request not found" });
    }

    return res.status(200).json({ message: "Follow-up request handled successfully", updatedRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getFollowUpRequest = async (req, res) => {
  console.log("Getting follow-up requests...");
  try {
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    const doctorId = doctor._id;
    console.log("doctor" + doctor);
    // Use the AppointmentModel to find follow-up appointments
    const followUpRequests = await AppointmentModel.find({
      doctorId,
      type: "follow up",
      status: "upcoming",
    }).populate('patientId', 'name');

    console.log("followUpRequests" + followUpRequests);
    res.status(200).json(followUpRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allMedicines = async (req, res) => {
  try {
    const medicines = await MedicineModel.find();
    res.status(200).json(medicines);
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const prescriptionDetails = async (req, res) => {
  try {
    const prescription = await PrescriptionModel.find({ _id: req.body.prescriptionId });
    res.status(200).json(prescription);
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

//npm install pdfkit 
import pdfkit from 'pdfkit'
import fs from 'fs'
import MedicineModel from '../models/medicine.js';
const printPresPDF = async (req, res) => {

  const id = req.params.id;
  const data = await PrescriptionModel.findById(id);
  if (!data) {
    console.error('pres not found ', error);
    return;
  }
  const patient = await PatientModel.findOne({ _id: data.patientId });
  const doctor = await DoctorModel.findOne({ user: res.locals.userId });
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


const addPrescription2 = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (!doctor) { res.status(400).send('dr not defined in my db'); return; }
    const { patientId, medicine } = req.body;
    console.log(medicine);
    const state = "unfilled"
    const date = (new Date());
    const doctorId = doctor._id;
    const newPres = new PrescriptionModel({ doctorId, patientId, state, medicine, date });
    await newPres.save();

    // add medicines to the patient's cart in the pharmacy
    // for (var element of medicine) {
    //   try {
    //     const result = await axios.request({
    //       method: 'get',
    //       url: "http://localhost:9000/medicine/searchMedForClinic",
    //       data: { name: element.name }
    //     });
    //     if (result) {
    //       console.log("medicine " + element.name + " id from the pharmacy " + result.data[0]._id);
    //       await axios.request({
    //         method: 'post',
    //         url: "http://localhost:9000/patient/addToCartFromClinic",
    //         data: { medicineId: result.data[0]._id, quantity: 1 }
    //       });
    //     }
    //   } catch (error) {
    //     console.error('Error while connecting to the pharmacy', error);
    //     res.status(500).send('Internal Server Error');
    //     return; // Stop the execution of the function
    //   }
    // }
    res.status(200).json(newPres);
  }
  catch (error) {
    console.error('Error adding a prescription', error);
    res.status(500).send('Internal Server Error');
  }
}

const updatePrescription = async (req, res) => {
  try {
    const predId = req.params.id;
    const prescription = await PrescriptionModel.findById(predId);
    const { medicine } = req.body;
    prescription.medicine = medicine;
    await prescription.save();
    res.status(200).json("updated successfully");
  }
  catch (error) {
    console.error('Error updating prescription', error);
    res.status(500).send('Internal Server Error');
  }
}

const updatePrescription_AddMed = async (req, res) => {

  try {
    const predId = req.params.id;
    const prescription = await PrescriptionModel.findById(predId);
    if (prescription.state == "filled") {
      res.status(200).send("cannot edit now !! , the prescription is filled");
      return;
    }
    const newMedicine = req.body;  // body = {name:"panadol" , dose:"once a day"}
    prescription.medicine.push(newMedicine);
    await prescription.save();

    //add it to the cart 
    const result = await axios.request({
      method: 'get',
      url: "http://localhost:9000/medicine/searchMedForClinic",
      data: { name: newMedicine.name }
    });

    if (result) {
      console.log("medicine " + newMedicine.name + " id from the pharmacy " + result.data[0]._id);
      await axios.request({
        method: 'post',
        url: "http://localhost:9000/patient/addToCartFromClinic",
        data: { medicineId: result.data[0]._id, quantity: 1 }
      });
    }
    res.status(200).json("updated successfully");

  } catch (error) {
    console.error('Error while updating prescription', error);
    res.status(500).send('Internal Server Error');
    return; // Stop the execution of the function
  }

}

const updatePrescription_DeleteMed = async (req, res) => {

  try {
    const predId = req.params.id;
    const prescription = await PrescriptionModel.findById(predId);
    if (prescription.state == "filled") {
      res.status(200).send("cannot edit now, the prescription is filled !!");
      return;
    }
    const oldMedicine = req.body;  // body = {name:"panadol"}
    prescription.medicine.pull({ name: oldMedicine.name })
    await prescription.save();

    //remove it from  cart 
    const result = await axios.request({
      method: 'get',
      url: "http://localhost:9000/medicine/searchMedForClinic",
      data: { name: oldMedicine.name }
    });

    if (result) {
      console.log("medicine " + oldMedicine.name + " id from the pharmacy " + result.data[0]._id);
      await axios.request({
        method: 'delete',
        url: "http://localhost:9000/patient/removeFromCartClinic",
        data: { medicineId: result.data[0]._id }
      });
    }
    res.status(200).json("updated successfully");
  } catch (error) {
    console.error('Error updating prescription', error);
    res.status(500).send('Internal Server Error');
  }

}

const updatePrescription_Dosage = async (req, res) => {

  try {
    const predId = req.params.id;
    const prescription = await PrescriptionModel.findById(predId);
    if (prescription.state == "filled") {
      res.status(200).send("cannot edit now !! , the prescription is filled");
      return;
    }
    const medicine = req.body; // body = {name:"panadol" , dose:"twice a day"}
    prescription.medicine = prescription.medicine.filter(med => med.name !== medicine.name);
    prescription.medicine.push(medicine)
    await prescription.save();
    res.status(200).send('Prescription updated successfully.');

  }
  catch (error) {
    console.error('Error updating medicine dosage', error);
    res.status(500).send('Internal Server Error');
  }
}


// const deletePrescription = async(req,res)=>{
//   //may need a condition 
//   try {
//     const { id } = req.params;
//     await PrescriptionModel.findByIdAndDelete(id);
//     res.sendStatus(204);  //done successfully
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// }

export default {
  createDoctor,
  getDoctorById,
  getDoctorByIdForChat,

  getDoctors,
  acceptDoctor,
  rejectDoctor,
  acceptDoctorContract,
  getContract,

  getAllDoctors,
  searchByNameOrSpec,
  filterBySpecOrAv,

  createDoctor,
  updateDoctor,
  getHealthRecord,
  getAcceptedDoctors,
  addAvailableTimeSlots,
  addHealthRecords,
  getWallet,

  updateAppointment,
  addPrescription,
  myPrescriptions,
  handleFollowUpRequest,
  getFollowUpRequest,
  updatecompletedAppointment,
  updatecancelledAppointment,
  getNotfication,
  sawNotfication,
  allMedicines,
  printPresPDF,
  prescriptionDetails,
  addPrescription2,
  updatePrescription,
  updatePrescription_AddMed,
  updatePrescription_DeleteMed,
  updatePrescription_Dosage




}