import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MainContent = ({ content }) => (
  <div
    style={{
      width: "60%",
      height: "calc(100vh - 100px)",
      border: "1px solid black",
    }}
  >
    {content}
  </div>
);

const DisplayAll = ({ doctors, sessDiscount }) => {
  return (
    <div style={{ overflow: "auto", height: 440 }}>
      {doctors.map((member) => (
        <div
          key={member._id}
          style={{ border: "1px solid black", borderRadius: 5 }}
        >
          <p>
            <strong>Doctor's name:</strong> {member.name}
          </p>
          <p>
            <strong>email:</strong> {member.email}
          </p>
          <p>
            <strong>hospital:</strong> {member.hospital}
          </p>
          <p>
            <strong>speciality:</strong> {member.speciality}
          </p>
          <p>
            <strong>session price/hourlyRate:</strong>{" "}
            {member.hourlyRate +
              member.hourlyRate * 0.1 -
              member.hourlyRate * (sessDiscount / 100)}
          </p>
        </div>
      ))}
    </div>
  );
};

const AllDoctors = (sessDiscount) => {
  //fetch all doctors and apply the discount
  const [doctors, setDoctors] = useState([]);
  axios
    .get("http://localhost:8000/doctor/getAcceptedDoctors")
    .then((response) => {
      setDoctors(response.data);
    });

  return (
    <DisplayAll
      doctors={doctors}
      sessDiscount={Number(sessDiscount.sessDiscount)}
    />
  );
};

const DoctorsWithDiscount = () => {
  const [content, setContent] = useState("");
  const [patientID, setPatientID] = useState("");
  const getDoctors = async () => {
    axios
      .post("http://localhost:8000/patient/getSessDiscount/", { id: patientID })
      .then((response) => {
        console.log(response.data.discount);
        setContent(
          <AllDoctors sessDiscount={Number(response.data.discount)} />
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div>
      <MainContent content={content} />
      <label style={{ display: "block" }}>
        Patient ID:
        <input
          type="text"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
        />
      </label>
      <button type="button" onClick={getDoctors}>
        view All Doctors
      </button>
    </div>
  );
};

export default DoctorsWithDiscount;
