import HealthPackageModel from '../models/healthPackage.js';
import HealthPackage from '../models/healthPackage.js';
import mongoose from 'mongoose';
import PatientModel from '../models/patient.js';
import FamilyMemberModel from '../models/familyMember.js';

// Controller function to retrieve all Health Packages (displayAll)
const getAllHealthPackages = async (req, res) => {
  try {
    const HealthPackages = await HealthPackage.find();
    res.status(200).json(HealthPackages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHealthPackageDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const HealthPackage1 = await HealthPackage.findById(id);
    res.status(200).json(HealthPackage1);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to create a new Health Package (addNew)
const createHealthPackage = async (req, res) => {
  try {
    const { name, price, sessDiscount, medDiscount, subDiscount } = req.body;
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price)) {
      throw new Error("Invalid price format. Please enter a valid number.");
    }
    const newHealthPackage = new HealthPackageModel({ name, price, sessDiscount, medDiscount, subDiscount });
    await newHealthPackage.save();
    res.status(200).json(newHealthPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller function to update an existing Health Package (findById + update)
const updateHealthPackage = async (req, res) => {
  try {
    const { id } = req.params;
    //const  {name,price,sessDiscount,medDiscount,subDiscount} = req.body ;
    const updatedHealthPackage = await HealthPackage.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedHealthPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller function to delete a Health Package
const deleteHealthPackage = async (req, res) => {
  try {
    const { id } = req.params;
    await HealthPackage.findByIdAndDelete(id);
    res.sendStatus(204);  //done successfully
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//expected to have patient's id in the url and HPname in the body req{}
//  /:id
const subscribeForPatient = async (req, res) => {
  try {
    //const patientID = req.params.id;
    const healthPackageName = req.body.HPname;
    const patient1 = await PatientModel.findOne({ user: res.locals.userId });
    const patientID = patient1._id;
    console.log(patient1);
    if (patient1.healthPackageSub == "") {
      const updatedPatient = await PatientModel.findByIdAndUpdate(patientID, {
        healthPackageSub: healthPackageName,
        DateOfSubscribtion: new Date(),
        subscriptionStatus: "subscribed with renewal date"
      }, { new: true });
      res.status(200).send("done");
      console.log("done");
    } else {
      res.status(200).send("already subscribed to Health package. Unsubscribe first.");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//expected to have family member's id in req.params & hpname in req.body
//  /:id
//req.body --> HPname
const subscribeForFamily = async (req, res) => {
  try {
    const FamilyMemberID = req.params.id;
    const healthPackageName = req.body.HPname;
    const FamilyMember = await FamilyMemberModel.findById(FamilyMemberID);
    if (FamilyMember.healthPackageSub == "") {
      FamilyMember.healthPackageSub = healthPackageName;
      FamilyMember.DateOfSubscribtion = (new Date());
      FamilyMember.subscriptionStatus = "subscribed with renewal date";
      FamilyMember.save();
      res.status(200).send("done");
    }
    else {
      res.status(200).send("already subscribed to Health package. Unsubscribe first.");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAllHealthPackages,
  getHealthPackageDetails,
  createHealthPackage,
  updateHealthPackage,
  deleteHealthPackage,
  subscribeForFamily,
  subscribeForPatient
};