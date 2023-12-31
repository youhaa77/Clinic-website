import { useState } from "react";
import axios from "axios";
import Button1 from "react-bootstrap/Button";
import Card1 from "react-bootstrap/Card";
import famImg from "../../images/famclinic.png";
import hpImg from "../../images/clinicHP.png";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import Button from "@mui/material/Button";
import ResponsiveAppBar from "../../components/TopBar";
import backgroundImage1 from "../../images/famclinic.png";

const PatientFM = () => {
  //assuming that patient id is in window.location named patientID
  const params = new URLSearchParams(window.location.search);
  let patientID = params.get("patientId");
  /////////////////////REMOVE THAT
  //patientID = "6529c70a6be1d55abc0d0114";
  const [addFamilyMemForm, setaddFamilyMemForm] = useState(false);
  const [linkFamilyMemForm, setlinkFamilyMemForm] = useState(false);
  const [nonlinkedfamily, setnonlinkedfamily] = useState([]);
  const [linkedfamily, setlinkedfamily] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  axios
    .get(`http://localhost:8000/patient/NotlinkedFamily/${patientID}`)
    .then((res) => {
      setnonlinkedfamily(res.data);
    })
    .catch((error) => {
      res.status(400).send(error);
      console.error("Error fetching data:", error);
    });

  axios
    .get(`http://localhost:8000/patient/LinkedFamily/${patientID}`)
    .then((res) => {
      setlinkedfamily(res.data);
    })
    .catch((error) => {
      res.status(400).send(error);
      console.error("Error fetching data:", error);
    });

  //add a new family member
  const [name, setName] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !nationalID || !age || !gender || !relation) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    const numberFormat = /^\d+$/;
    const nameFormat = /^[a-zA-Z\s]+$/;
    if (!numberFormat.test(nationalID)) {
      setErrorMessage("invalid nationalID format");
      return;
    }

    if (!nameFormat.test(name)) {
      setErrorMessage("Invalid text format");
      return;
    }

    try {
      const familyMember = { name, nationalID, age, gender, relation };
      console.log(familyMember);
      const response = await axios.post(
        `http://localhost:8000/patient/AddFamilyMember/${patientID}`,
        familyMember
      );

      setErrorMessage(response.data);

      if (!response.data.errorMessage) {
        // Update the nonlinkedfamily state with the new member
        setnonlinkedfamily((prevNonLinkedFamily) => [
          ...prevNonLinkedFamily,
          response.data.familyMember,
        ]);
      }
      console.log("After adding family member:", nonlinkedfamily);

      setName("");
      setAge("");
      setGender("");
      setNationalID("");
      setRelation("");
    } catch (error) {
      console.error(error);
    }
  };
  const linkPatient = (event) => {
    event.preventDefault();
    if (!name || !relation) {
      alert("Please fill in all fields.");
      return;
    }
    //the name var here is the input (mail or number)
    const numberFormat = /^\d+$/;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!numberFormat.test(name) && !mailFormat.test(name)) {
      alert("invalid input format");
      return;
    }
    try {
      //console.log({"input":name,"relation":relation})
      const body = { input: name, relation: relation };
      axios
        .post("http://localhost:8000/patient/linkPatient/" + patientID, body)
        .then((res) => alert(res.data));
    } catch (error) {
      console.error(error);
    }

    setName("");
    setRelation("");
    setlinkFamilyMemForm(false);
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
          className="card col-12 mt-3 mb-3"
          style={{ maxWidth: "80%", marginLeft: "10%" }}
        >
          <div style={{ "text-align": "left", color: "#000000" }}>
            <div>
              <h2>Family members</h2>
            </div>
            {nonlinkedfamily.map((member) => (
              <div
                key={member?.id}
                style={{
                  border: "1px solid black",
                  "text-align": "center",
                  "margin-bottom": "10px",
                  width: 500,
                  borderRadius: 5,
                }}
              >
                <p>
                  <strong>Name:</strong> {member?.name}
                </p>
                <p>
                  <strong>National ID:</strong> {member?.nationalID}
                </p>
                <p>
                  <strong>Age:</strong> {member?.age}
                </p>
                <p>
                  <strong>Gender:</strong> {member?.gender}
                </p>
                <p>
                  <strong>Relation:</strong> {member?.relation}
                </p>
                <p>
                  <strong>health package subscription:</strong>{" "}
                  {member?.healthPackageSub}
                </p>
                <p>
                  <strong>subscription due date:</strong>{" "}
                  {member?.DateOfSubscribtion}
                </p>
                <p>
                  <strong>subscription status:</strong>{" "}
                  {member?.subscriptionStatus}
                </p>
              </div>
            ))}
            <Button1
              style={{ "margin-bottom": "10px" }}
              onClick={() => {
                setaddFamilyMemForm(true);
              }}
            >
              Add a new Family member
            </Button1>
            {addFamilyMemForm ? (
              <div id="add_familyMemebr_form">
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Floating
                      className="mb-3"
                      style={{ width: 500, borderRadius: 5 }}
                    >
                      <Form.Control
                        id="floatingInputCustom"
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="floatingInputCustom">Full name</label>
                    </Form.Floating>
                  </Form.Group>
                  <Form.Floating
                    className="mb-3"
                    style={{ width: 500, borderRadius: 5 }}
                  >
                    <Form.Control
                      id="floatingInputCustom"
                      type="text"
                      placeholder="national ID"
                      value={nationalID}
                      onChange={(e) => setNationalID(e.target.value)}
                    />
                    <label htmlFor="floatingInputCustom">national ID</label>
                  </Form.Floating>

                  <Form.Floating
                    className="mb-3"
                    style={{ width: 500, borderRadius: 5 }}
                  >
                    <Form.Control
                      id="floatingInputCustom"
                      type="text"
                      placeholder="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                    <label htmlFor="floatingInputCustom">age</label>
                  </Form.Floating>

                  <Form.Select
                    aria-label="Default select example"
                    style={{
                      width: 500,
                      borderRadius: 5,
                      "margin-bottom": "10px",
                    }}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>

                  <Form.Select
                    aria-label="Default select example"
                    style={{
                      width: 500,
                      borderRadius: 5,
                      "margin-bottom": "10px",
                    }}
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                  >
                    <option>Relation</option>
                    <option value="child">child</option>
                    <option value="wife">wife</option>
                    <option value="husband">husband</option>
                  </Form.Select>
                  {errorMessage && (
                    <div style={{ color: "red" }}>{errorMessage}</div>
                  )}
                  <Button1 type="submit" onClick={handleSubmit}>
                    Submit
                  </Button1>
                </Form>
              </div>
            ) : null}

            <div style={{ height: 30 }}></div>

            <div style={{ width: 500, borderRadius: 5 }}>
              <h2>linked family accounts</h2>
            </div>
            {linkedfamily.map((member) => (
              <div
                key={member.id}
                style={{
                  border: "1px solid black",
                  "text-align": "center",
                  "margin-bottom": "10px",
                  width: 500,
                  borderRadius: 5,
                }}
              >
                <p>
                  <strong>Name:</strong> {member.name}
                </p>
                <p>
                  <strong>Age:</strong> {member.age}
                </p>
                <p>
                  <strong>Gender:</strong> {member.gender}
                </p>
                <p>
                  <strong>Relation:</strong> {member.relation}
                </p>
                <p>check!!! sheel al part dah</p>
                <p>
                  <strong>health package subscription:</strong>{" "}
                  {member.healthPackageSub}
                </p>
                <p>
                  <strong>subscription due date:</strong>{" "}
                  {member.DateOfSubscribtion}
                </p>
                <p>
                  <strong>subscription status:</strong>{" "}
                  {member.subscriptionStatus}
                </p>
              </div>
            ))}
            <Button1
              style={{ "margin-bottom": "10px" }}
              onClick={() => {
                setlinkFamilyMemForm(true);
              }}
            >
              link with patient's account
            </Button1>
            {linkFamilyMemForm ? (
              <div>
                <Form>
                  <Form.Floating
                    className="mb-3"
                    style={{ width: 500, borderRadius: 5 }}
                  >
                    <Form.Control
                      id="floatingInputCustom"
                      type="text"
                      placeholder="email address or phone number"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="floatingInputCustom">
                      email address or phone number
                    </label>
                  </Form.Floating>

                  <Form.Select
                    aria-label="Default select example"
                    style={{
                      width: 500,
                      borderRadius: 5,
                      "margin-bottom": "10px",
                    }}
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                  >
                    <option>Relation</option>
                    <option value="child">child</option>
                    <option value="wife">wife</option>
                    <option value="husband">husband</option>
                  </Form.Select>
                  <Button1 type="submit" onClick={linkPatient}>
                    Submit
                  </Button1>
                </Form>
              </div>
            ) : null}
          </div>
        </div>
      </AppBar>
    </div>
  );
};
//<p style={{ backgroundImage: `url(${backgroundImage1})` , backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}}>
//.filter(member => member.healthPackageSub !== '') in line 433
export default PatientFM;
