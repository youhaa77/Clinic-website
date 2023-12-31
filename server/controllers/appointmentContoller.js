import mailer from "nodemailer";
import appointments from "../models/appointment.js";
import DoctorModel from '../models/doctor.js';
import PatientModel from "../models/patient.js";
//filtering options:(date) (status) (date&status) (no filter)
import { constants } from 'crypto';
import AppointmentModel from '../models/appointment.js';


const createAppointment = async (req, res) => {
  const patient1 = await PatientModel.findOne({ user: res.locals.userId });
  const patientId = patient1._id;
  const {
    doctorId,
    date,
    status,
    type
  } = req.body;
  console.log(req.body)
  try {
    const appointment = new AppointmentModel({
      doctorId,
      patientId,
      date,
      status,
      type
    });
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { "_id": doctorId },
      { $pull: { availableSlots: date } },
      { new: true } // To return the updated document
    );
    const updatedPatient = await PatientModel.findOneAndUpdate(
      { "_id": patientId },
      { $inc: { wallet: -50 } },
      { new: true } // To return the updated document
    );
    console.log(updatedDoctor);
    console.log(updatedPatient);
    await appointment.save();
    console.log(appointment);


    const message = `this message is to notify you about your appointment details:
    doctor ${updatedDoctor.name} : patient ${updatedPatient.name} : date : ${appointment.date}  `;

    const notifi = {
      title: "Reserved",
      data: message,
      state: "Unread"
    }
    const docNotification = [...updatedDoctor.notifications, notifi];
    const patNotification = [...updatedPatient.notifications, notifi]
    updatedDoctor.notifications = docNotification;
    updatedPatient.notifications = patNotification;
    await updatedDoctor.save();
    await updatedPatient.save();

    //maillll
    let config = {
      service: "gmail",
      auth: {
        user: process.env.mail,
        pass: process.env.appPss

      },
      tls: {
        rejectUnauthorized: false
      },
    }

    let transporter = mailer.createTransport(config);

    let messagee = {
      from: process.env.mail, // sender address
      to: [updatedDoctor.email, updatedPatient.email], // list of receivers
      subject: "Hello ✔", // Subject line
      text: message // plain text body
      //html: "<b>your verification code is 5555</b>", // html body
    }

    transporter.sendMail(messagee).then((info) => {
      console.log(info);
      return res.status(200).json(appointment);
    }).catch(error => {
      console.log(error)
      return res.status(200).json(appointment);

    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};

const getAllAppointments = async (req, res) => {
  try {
    const user = await AppointmentModel.find();
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

// the doctor does that 
const createFollowUp = async (req, res) => {
  const doctor1 = await DoctorModel.findOne({ user: res.locals.userId });
  const doctorId = doctor1._id;
  const {
    patientId,
    date,
    status,
    type
  } = req.body;
  console.log(req.body)
  try {
    const appointment = new AppointmentModel({
      doctorId,
      patientId,
      date,
      status,
      type
    });
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { "_id": doctorId },
      { $pull: { availableSlots: date } },
      { new: true } // To return the updated document
    );
    const updatedPatient = await PatientModel.findOneAndUpdate(
      { "_id": patientId },
      { $inc: { wallet: -50 } },
      { new: true } // To return the updated document
    );
    console.log(updatedDoctor);
    console.log(updatedPatient);
    await appointment.save();
    console.log(appointment);


    const message = `this message is to notify you about your appointment details:
    doctor ${updatedDoctor.name} : patient ${updatedPatient.name} : date : ${appointment.date}  `;

    const notifi = {
      title: "Reserved",
      data: message,
      state: "Unread"
    }
    const docNotification = [...updatedDoctor.notifications, notifi];
    const patNotification = [...updatedPatient.notifications, notifi]
    updatedDoctor.notifications = docNotification;
    updatedPatient.notifications = patNotification;
    await updatedDoctor.save();
    await updatedPatient.save();

    //maillll
    let config = {
      service: "gmail",
      auth: {
        user: process.env.mail,
        pass: process.env.appPss

      },
      tls: {
        rejectUnauthorized: false
      },
    }

    let transporter = mailer.createTransport(config);

    let messagee = {
      from: process.env.mail, // sender address
      to: [updatedDoctor.email, updatedPatient.email], // list of receivers
      subject: "Hello ✔", // Subject line
      text: message // plain text body
      //html: "<b>your verification code is 5555</b>", // html body
    }

    transporter.sendMail(messagee).then((info) => {
      console.log(info);
      return res.status(200).json(appointment);
    }).catch(error => {
      console.log(error)
      return res.status(200).json(appointment);

    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};

const getPatientAppointments = async (req, res) => {
  try {
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient1._id;
    const appointments = await AppointmentModel.find({ patientId: patientID })
      .populate('patientId')  // Populate the patientId field with actual patient information
      .populate('doctorId')
      .exec();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getMyAppointmers = async (req, res) => {

  try {
    // console.log("backend esht5l")
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (patient) {
      console.log("Patient")
      const Appointments = await AppointmentModel.find({ patientId: patient._id }).populate('doctorId');
      res.status(200).json(Appointments);
    }
    else if (doctor) {
      console.log("Doctor")
      const Appointments = await AppointmentModel.find({ doctorId: doctor._id }).populate('patientId');
      res.status(200).json(Appointments);
    }
    else {
      res.status(401).json({ error: 'No call' });
    }
  } catch (error) {
    console.error('Error in getwallet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}



//test it using http://localhost:8000/doctor/appointmentWithFilter?startDate=2002-1-1&endDate=2003-1-1

const getAppointmentWithFilter = async (req, res) => {
  try {
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    const { startDate, endDate, status } = req.body; // Destructure status and dates from query parameters
    const query = {}; // Initialize the query with patientId

    if (patient) {
      query.patientId = patient._id
    }
    if (doctor) {
      query.doctorId = doctor._id
    }
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      let start = new Date(startDate);
      let end = new Date(endDate);

      if (start.toDateString() === end.toDateString()) {
        end.setDate(end.getDate() + 1);
      }

      if (end > start) {
        end.setDate(end.getDate() + 1);
        query.date = {
          $gte: start,
          $lt: end,
        };
      } else {
        return res.status(400).json({ error: "Please enter a valid date range" });
      }
    }

    const appointment = await appointments.find(query).populate('doctorId').populate('patientId');
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAppointments = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    // const doctorName = req.params.doctorName;
    // console.log("doctorname" + doctorName);
    // const doctor = await DoctorModel.findOne({ name: doctorName });
    console.log("doctor" + doctor);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const appointments = await AppointmentModel.find({ doctorId: doctor._id }).populate('doctorId').populate('patientId');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getupcomingAppointments = async (req, res) => {
  try {
    const { patientId } = req.params; // Extract patientId from request parameters
    console.log('Requested Patient ID:', patientId);
    console.log('Doctor ID:', res.locals.userId);

    // Check if the doctor ID is valid
    if (!res.locals.userId) {
      return res.status(400).json({ error: 'Invalid Doctor ID' });
    }

    // Attempt to find the doctor by user ID
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });

    if (!doctor) {
      // Doctor not found, handle this case (e.g., send an appropriate response)
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctorID = doctor._id;
    const appointments = await AppointmentModel.find({
      doctorId: doctorID,
      status: 'upcoming',
    })
      .populate({
        path: 'patientId',
        select: 'name email', // Select the fields you want to retrieve
      });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error in getupcomingAppointments:', error);
    res.status(500).json({ error: error.message });
  }
};
const patientApp = async (req, res) => {
  try {
    const { patientId } = req.body;
    const appointment = await appointments.find({ patientId: patientId });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const rescheduleAppointment = async (req, res) => {
  try {
    const { _id, date } = req.body; // Destructure status and dates from query parameters
    let query = {};

    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    if (patient) {
      query.patientId = patient._id;
    }

    if (doctor) {
      query.doctorId = doctor._id;
    }
    if (_id) {
      query._id = _id;
    }
    if (date) {
      query.date = date;
    }
    const appointment = await AppointmentModel.findOne({ _id: query._id });
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { "_id": appointment.doctorId },
      { $push: { availableSlots: appointment.date } },
      { new: true } // To return the updated document
    );
    const updatedDoctorAgain = await DoctorModel.findOneAndUpdate(
      { "_id": appointment.doctorId },
      { $pull: { availableSlots: query.date } },
      { new: true } // To return the updated document
    );
    const updatedApp = await AppointmentModel.findOneAndUpdate(
      { "_id": _id },
      { $set: { date: query.date } },
      { new: true } // To return the updated document
    );
    const updatedAppAgain = await AppointmentModel.findOneAndUpdate(
      { "_id": _id },
      { $set: { status: "rescheduled" } },
      { new: true } // To return the updated document
    );
    console.log(updatedApp);
    const updatedPatient = await PatientModel.findById(updatedApp.patientId);
    ////notification
    const message = `this message is to notify you about your appointment Reschadule details:
doctor ${updatedDoctor.name} : patient ${updatedPatient.name} : date from :${appointment.date} to: ${updatedAppAgain.date}  `;

    const notifi = {
      title: "Reschaduled",
      data: message,
      state: "Unread"
    }
    const docNotification = [...updatedDoctor.notifications, notifi];
    const patNotification = [...updatedPatient.notifications, notifi]
    updatedDoctor.notifications = docNotification;
    updatedPatient.notifications = patNotification;
    await updatedDoctor.save();
    await updatedPatient.save();

    //maillll
    let config = {
      service: "gmail",
      auth: {
        user: process.env.mail,
        pass: process.env.appPss

      },
      tls: {
        rejectUnauthorized: false
      },
    }

    let transporter = mailer.createTransport(config);

    let messagee = {
      from: process.env.mail, // sender address
      to: [updatedDoctor.email, updatedPatient.email], // list of receivers
      subject: "Hello ✔", // Subject line
      text: message // plain text body
      //html: "<b>your verification code is 5555</b>", // html body
    }

    transporter.sendMail(messagee).then((info) => {
      console.log(info);
    }).catch(error => {
      console.log(error)
    })


    res.status(200).json(updatedApp);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};
const cancelAppointment = async (req, res) => {
  try {
    const { _id } = req.body;
    let query = {};
    if (_id) {
      query._id = _id;
    }
    const appointment = await AppointmentModel.findOne({ _id: query._id });
    const patient = await PatientModel.findOne({ user: res.locals.userId });
    const doctor = await DoctorModel.findOne({ user: res.locals.userId });
    console.log(appointment);
    console.log(patient);
    var updatedPatient = patient;


    if (patient) {
      query.patientId = patient._id;
      if (appointment) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const appointmentDate = new Date(appointment.date);

        if (appointmentDate < twentyFourHoursAgo) {
          // The appointment date is less than 24 hours before now
          console.log("Appointment is less than 24 hours before now.");
          updatedPatient = await PatientModel.findOneAndUpdate(
            { "_id": appointment.patientId },
            { $inc: { wallet: 50 } },
            { new: true } // To return the updated document
          );
        } else {
          // The appointment is more than 24 hours away
          console.log("Appointment is more than 24 hours away.");
        }
      } else {
        // Handle the case where no appointment is found
        console.log("Appointment not found.");
      }
    }

    if (doctor) {
      query.doctorId = doctor._id;
      updatedPatient = await PatientModel.findOneAndUpdate(
        { "_id": appointment.patientId },
        { $inc: { wallet: 50 } },
        { new: true } // To return the updated document
      );
    }
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { "_id": appointment.doctorId },
      { $push: { availableSlots: appointment.date } },
      { new: true } // To return the updated document
    );
    //await AppointmentModel.deleteOne({ _id: query._id });
    //const updatedApp = await AppointmentModel.find();
    const updatedApp = await AppointmentModel.findOneAndUpdate(
      { "_id": query._id },
      { $set: { status: "cancelled" } },
      { new: true } // To return the updated document
    );
    console.log(updatedPatient);
    //notificationnn
    const message = `this message is to notify you about appointment cancellation details:
    doctor ${updatedDoctor.name} : patient ${updatedPatient.name} : date : ${updatedApp.date}  `;

    const notifi = {
      title: "Cancelled",
      data: message,
      state: "Unread"
    }
    const docNotification = [...updatedDoctor.notifications, notifi];
    const patNotification = [...updatedPatient.notifications, notifi]
    updatedDoctor.notifications = docNotification;
    updatedPatient.notifications = patNotification;
    await updatedDoctor.save();
    await updatedPatient.save();

    //maillll
    let config = {
      service: "gmail",
      auth: {
        user: process.env.mail,
        pass: process.env.appPss

      },
      tls: {
        rejectUnauthorized: false
      },
    }

    let transporter = mailer.createTransport(config);

    let messagee = {
      from: process.env.mail, // sender address
      to: [updatedDoctor.email, updatedPatient.email], // list of receivers
      subject: "Hello ✔", // Subject line
      text: message // plain text body
      //html: "<b>your verification code is 5555</b>", // html body
    }

    transporter.sendMail(messagee).then((info) => {
      console.log(info);
    }).catch(error => {
      console.log(error)
    })

    console.log(updatedApp);
    res.status(200).json(updatedApp);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

};
export default {
  createAppointment,
  createFollowUp,
  getAllAppointments,
  getAppointmentWithFilter,
  getAppointments,
  patientApp,
  getPatientAppointments,
  rescheduleAppointment,
  cancelAppointment,
  getMyAppointmers,
  getupcomingAppointments
}
