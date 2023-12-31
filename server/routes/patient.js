import express from "express";
import controllers from "../controllers/patient.js";
import doctor from "../controllers/doctor.js";
import healthPackageController from "../controllers/healthPackageController.js";
import FamilyMemberController from "../controllers/FamilyMemberController.js";
import appointmentContoller from "../controllers/appointmentContoller.js";
import patient from "../controllers/patient.js";
import Auth from "../Authentication/login.js"
import Middle from "../Authentication/Middleware.js";
import uploadMiddleware from "../middlewares/uploadmiddleware.js";

const router = express.Router();


router.post("/", controllers.createPatient);
router.get("/", controllers.getPatients); // TODO: Add auth middleware
router.get("/getNotfication", Middle.requireAuthPatient, controllers.getNotfication);

router.get("/sawNotfication", Middle.requireAuthPatient, controllers.sawNotfication);
router.get("/byId", Middle.requireAuth, controllers.getPatientById);
router.get("/getPatientHealthPackage", Middle.requireAuthPatient, controllers.getPatientHealthPackage);

router.get("/getPerscriptions", Middle.requireAuthPatient, controllers.getPrescriptions)
router.post("/filterPerscriptions", Middle.requireAuthPatient, controllers.filterPres)
router.get("/getPerscription/:id", Middle.requireAuthPatient, controllers.getPres)
router.get("/prescriptionPDF/:id",Middle.requireAuthPatient,patient.printPresPDF)
router.post("/payForPrescription/:id",Middle.requireAuthPatient,patient.payPrescription)

router.post("/patientLogin", Auth.loginPatient)

//view all the health packages 
//when testing it on postman, make sure to send the request with an empty body {} 
router.get('/healthPackage', Middle.requireAuthPatient, healthPackageController.getAllHealthPackages);
router.get('/healthPackage/:id', Middle.requireAuthPatient, healthPackageController.getHealthPackageDetails);

//subscribe for a health package for me or my fam
router.post("/subscribeForMe/:id", Middle.requireAuthPatient, healthPackageController.subscribeForPatient);
router.post("/subscribeForFam/:id", Middle.requireAuthPatient, healthPackageController.subscribeForFamily);

//cancel sub
router.post('/cancelMYsubscription/:id', Middle.requireAuthPatient, patient.cancelSubscription);
router.post('/cancelFMsubscription/:id', Middle.requireAuthPatient, FamilyMemberController.cancelSubscription);

//unsubscribe
router.post('/unsubscribeForMe/:id', Middle.requireAuthPatient, patient.unsubscribe);
router.post('/unsubscribeForMember/:id', Middle.requireAuthPatient, FamilyMemberController.unsubscribe);


//display patient's detials including HP subscription
// do we need to update healthpackage subsc. if it is expired (duration 1 year)
router.get('/patientdetails/:patientID', Middle.requireAuthPatient, patient.patientDetails);
router.get("/getWallet/:patientName", Middle.requireAuthPatient, controllers.getWallet)
//get or add family members
router.get("/NotlinkedFamily/:patientID", Middle.requireAuthPatient, FamilyMemberController.getNotLinkedFamMembers);
router.get("/LinkedFamily/:patientID", Middle.requireAuthPatient, FamilyMemberController.getLinkedFamMembers);

router.post("/AddFamilyMember/:patientID", Middle.requireAuthPatient, FamilyMemberController.addNewFamilyMember);

// link or add a family member using mail or phone number
router.post("/linkPatient/:patientID", Middle.requireAuthPatient, patient.linkPatient);

//for patient - family member connection
// router.get("/Family/:patientID", FamilyMemberController.getAllFamMembers);
// router.post("/AddFamilyMember/:patientID", FamilyMemberController.addNewFamilyMember);

//apply sessDiscount on dr's session price
router.post('/getsessDiscount/', Middle.requireAuthPatient, controllers.getSessDiscount);
router.put('/updateWallet', Middle.requireAuthPatient, controllers.updateWallet);


//view all the health packages 
router.get('/health-records/:patientId', Middle.requireAuthPatient, controllers.getHealthRecords);
router.put('/health-records', Middle.requireAuthPatient, uploadMiddleware, controllers.addHealthRecord);
router.put('/remove-health-records', Middle.requireAuthPatient, controllers.removeHealthRecord);
//view appointments
router.post("/appointmentWithFilter", Middle.requireAuth, appointmentContoller.getAppointmentWithFilter);


router.get('/mydiscount/:id', Middle.requireAuthPatient, patient.checkIfLinked);

//sss
router.get("/allDoctors", Middle.requireAuthPatient, doctor.getAllDoctors);
router.get("/docInfo/:id", Middle.requireAuthPatient, doctor.getDoctorById);
router.get("/docSearch", Middle.requireAuthPatient, doctor.searchByNameOrSpec);
router.post("/docFilter", Middle.requireAuthPatient, doctor.filterBySpecOrAv);

// router.get("/searchDocNameASpec", doctor.getDoctorByNameASpec);
// router.get("/searchDocNameOrSpec", doctor.getDoctorByNameOrSpec);
// router.get("/searchDocSpecASlots", doctor.getDoctorAvailableAndS);
// if your route is : router.post("/something", controllers.something)
// then test it by sending post request to this route: http://localhost:8000/patient/something

// lw mesh fahem el "/patient" gat mnen fa e7na 3amlenha fi el index.js file fi el line da (app.use("/patient", patientRoutes);)
router.post("/myApp", Middle.requireAuthPatient, appointmentContoller.patientApp);
router.get("/prescriptions", Middle.requireAuthPatient, controllers.myPrescriptions);
//router.get("/prescriptions", controllers.myPrescriptions);
router.post("/followUpRequest", Middle.requireAuthPatient, controllers.requestFollowUp);
//router.post("/followUpRequest", controllers.requestFollowUp);


export default router; 
