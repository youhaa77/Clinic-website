import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../../components/TopBarDoc";
import { useNavigate } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  FormLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
function AddPrescription() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineDose, setMedicineDose] = useState(0);
  const [medicineNotes, setMedicineNotes] = useState("");
  const [allMedicines, setallMedicines] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isFormValid = prescriptionMedicines.length > 0;
  const isMedicineSelected = medicineName != "";

  // get all medicines
  useEffect(() => {
    axios
      .get(`http://localhost:8000/doctor/allMedicines`)
      .then((response) => {
        setallMedicines(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch doctor:", error);
      });
  }, []);

  // handle adding prescription
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .post("http://localhost:8000/doctor/addPrescription", {
          medicine: prescriptionMedicines,
          patientId: id,
        })
        .then(() => {
          setIsAdded(true);
        });
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  const handleBack = () => {
    navigate("/viewMyPatients");
  };
  const handleRemoveMedicine = (name) => {
    setPrescriptionMedicines(
      prescriptionMedicines.filter((m) => {
        return m.name != name;
      })
    );
  };
  const handleEditMedicine = (m) => {
    setDialogOpen(true);
    setIsEditing(true);
    setMedicineName(m.name);
    setMedicineDose(m.dose);
    setMedicineNotes(m.notes);
  };
  // opens the dialog
  const handleAddMedicine = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setMedicineName("");
    setMedicineDose(0);
    setMedicineNotes("");
  };
  const confirmMedicine = () => {
    prescriptionMedicines.push({
      name: medicineName,
      dose: medicineDose,
      notes: medicineNotes,
    });
    setDialogOpen(false);
    setIsEditing(false);
    setMedicineName("");
    setMedicineDose(0);
    setMedicineNotes("");
    console.log(prescriptionMedicines);
  };
  const updateConfirmMedicine = () => {
    prescriptionMedicines.forEach((m) => {
      if (m.name == medicineName) {
        (m.dose = medicineDose), (m.notes = medicineNotes);
      }
    });
    setDialogOpen(false);
    setIsEditing(false);
    setMedicineName("");
    setMedicineDose(0);
    setMedicineNotes("");
    console.log(prescriptionMedicines);
  };
  return (
    <div style={{ marginRight: "-5%", marginLeft: "-5%" }}>
      <AppBar
        style={{
          height: "100%",
          backgroundColor: "#F0F0F0",
          overflowY: "auto",
        }}
      >
        <ResponsiveAppBar />
        <div
          style={{
            backgroundColor: " rgb(65, 105, 225)",
            borderRadius: "50px",
            margin: "10px",
            width: "40%",
            marginLeft: "30%",
          }}
        >
          <h1
            style={{
              font: "Arial",
              fontWeight: "bold",
              color: "white",
              margin: "10px",
            }}
          >
            Add Prescription
          </h1>
        </div>
        <div
          className="card m-3 col-12"
          style={{ width: "80%", borderRadius: "20px", left: "8%" }}
        >
          {isAdded && (
            <div
              style={{
                height: "50px",
                backgroundColor: "green", // Set the background color to green
                color: "white", // Set the text color to white
                display: "flex",
              }}
              className="alert alert-primary d-flex align-items-center"
              role="alert"
            >
              <div>Prescription added successfully!</div>
            </div>
          )}
          {/* Reservation Dialog */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Add Medicine</DialogTitle>
            <DialogContent>
              {!isEditing && (
                <FormControl fullWidth>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Choose Medicine
                  </FormLabel>
                  <select
                    className="form-select"
                    onChange={(e) => setMedicineName(e.target.value)}
                  >
                    <option key={""} value={""}></option>
                    {allMedicines.map((medicine) => (
                      <option
                        key={medicine.medicineName}
                        value={medicine.medicineName}
                      >
                        {medicine.medicineName}
                      </option>
                    ))}
                  </select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Dose
                </FormLabel>
                <TextField
                  type="number"
                  value={medicineDose}
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setMedicineDose(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Notes
                </FormLabel>
                <TextField
                  type="text"
                  value={medicineNotes}
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setMedicineNotes(e.target.value)}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              {!isEditing && (
                <Button
                  onClick={confirmMedicine}
                  color="primary"
                  disabled={!isMedicineSelected}
                >
                  Add
                </Button>
              )}
              {isEditing && (
                <Button onClick={updateConfirmMedicine} color="primary">
                  Update
                </Button>
              )}
            </DialogActions>
          </Dialog>
          {prescriptionMedicines.map((medicine) => (
            <div
              key={medicine}
              style={{
                height: "50px",
                backgroundColor: "#e2e3e5", // Set the background color to green
                color: "black", // Set the text color to white
                display: "flex",
                justifyContent: "space-between",
              }}
              className="alert d-flex align-items-center"
              role="alert"
            >
              <div>{medicine.name}</div>
              <div>dose: {medicine.dose}</div>
              <div>{medicine.notes}</div>
              <div>
                <IconButton
                  className="btn"
                  onClick={() => handleEditMedicine(medicine)}
                >
                  <EditIcon></EditIcon>
                </IconButton>
                <IconButton
                  className="btn"
                  onClick={() => handleRemoveMedicine(medicine.name)}
                >
                  <HighlightOffIcon></HighlightOffIcon>
                </IconButton>
              </div>
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <Tooltip title="add medicine" placement="top">
                  <IconButton
                    onClick={handleAddMedicine}
                    type="submit"
                    className="btn btn-primary m-2"
                  >
                    <AddCircleOutlineIcon></AddCircleOutlineIcon>
                  </IconButton>
                </Tooltip>
              </div>

              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid}
              >
                add Prescription
              </button>
            </div>
          </form>
        </div>
        <button
          className="btn btn-primary rounded-2"
          style={{
            position: "absolute",
            bottom: "1%",
            right: "5%",
            width: "5%",
            height: "40px",
          }}
          onClick={handleBack}
        >
          Back
        </button>
      </AppBar>
    </div>
  );
}

export default AddPrescription;
