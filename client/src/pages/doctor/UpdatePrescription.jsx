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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
function UpdatePrescription() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [medicineDose, setMedicineDose] = useState(0);
  const [medicineNotes, setMedicineNotes] = useState("");
  const [allMedicines, setallMedicines] = useState([]);
  const [prescription, setPrescription] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { id, prescriptionId } = useParams();
  const navigate = useNavigate();
  const isFormValid = prescriptionMedicines.length > 0;
  const isMedicineSelected = medicineName != "";
  const canBeEdited = prescription.status != "filled";

  // get all medicines
  useEffect(() => {
    axios
      .get(`http://localhost:8000/doctor/allMedicines`)
      .then((response) => {
        setallMedicines(response.data);
      })
      .catch((error) => {
        console.error("Failed to medicines:", error);
      });

    axios
      .post(`http://localhost:8000/doctor/prescriptionDetails`, {
        prescriptionId: prescriptionId,
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setPrescription(response.data[0]);
          setPrescriptionMedicines(response.data[0].medicine);
        }
      })
      .catch((error) => {
        console.error("Failed to prescription:", error);
      });
  }, []);

  // handle adding prescription
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .put(
          "http://localhost:8000/doctor/updatePrescription/" + prescriptionId,
          {
            medicine: prescriptionMedicines,
          }
        )
        .then(() => {
          setIsAdded(true);
        });
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  const handleDownload = async () => {
    try {
      // Make a request to the backend endpoint
      const response = await axios.get(
        `http://localhost:8000/doctor/prescriptionPDF/${prescriptionId}`,
        {
          responseType: "arraybuffer", // Ensure the response type is set to arraybuffer for binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "prescription.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error as needed
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
            Prescription Details
          </h1>
        </div>
        <div>
          <Tooltip title="download" placement="bottom">
            <IconButton onClick={handleDownload} type="submit" className="m-2">
              <FileDownloadIcon></FileDownloadIcon>
            </IconButton>
          </Tooltip>
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
              <div>Prescription updated successfully!</div>
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
              {canBeEdited && (
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
              )}
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            {canBeEdited && (
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
                  update Prescription
                </button>
              </div>
            )}
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

export default UpdatePrescription;
