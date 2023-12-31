import "../init";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import ResponsiveAppBar from "../../components/TopBarHome";

import axios from "axios";
//import AssignmentIcon from "@mui/icons/Assignment"
//import PhoneIcon from "@mui/icons/Phone"
import PhoneIcon from "@mui/icons-material/Phone";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
//import { Peer } from "peerjs";
import Peer from "simple-peer";

import io from "socket.io-client";

const token = JSON.parse(sessionStorage.getItem("token"));

const socket = io.connect("http://localhost:8000", {
  query: {
    username: "john_doe",
    room: token,
  },
});

function Call() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [videoAsp, setAsp] = useState(300);
  const [callEnded, setCallEnded] = useState(false);
  const [calling, setCalling] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const containerStyles = {
    background: "linear-gradient(to bottom, #22c1c3, #64bf90)",
    height: "100vh", // Adjust the height as needed
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  useEffect(() => {
    if (location.state != null) {
      setCallAccepted(true);
      setAsp(150);
      console.log(location.state.back);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          console.log("stream   " + stream);
          myVideo.current.srcObject = stream;
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          });

          peer.on("signal", (data) => {
            console.log("the caller   " + caller);
            socket.emit("answerCall", {
              signal: data,
              to: location.state.caller,
            });
          });
          peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
          });

          peer.signal(location.state.callerUserSignal);
          connectionRef.current = peer;
        });
    }

    const apiUrl = "http://localhost:8000/appointment/getAppCall";
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    console.log("sssss" + stream);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      console.log(id);

      setMe(id);
      console.log("mmmmmm---" + me);
    });

    //    socket.emit("callUser", { userToCall: "someUserId", signalData: "someSignalData", from: "frontendUser", name: "Frontend User" });

    socket.on("callUser", (data) => {
      setReceivingCall(true);

      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("callEnded", () => {
      setCalling(false);
    });
  }, []);

  const callUser = (id) => {
    if (id.patientId.user) {
      id = id.patientId.user;
      console.log(id);
    } else {
      id = id.doctorId.user;
      console.log(id);
    }
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      //console.log(data);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        fromTok: token,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCalling(false);
      setAsp(150);
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setAsp(150);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log("the caller   " + caller);
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("destroooo");
    socket.emit("left");

    connectionRef.current.destroy();
    window.location.pathname = "/HomePage";
    console.log(location.state);

    /*	if(location.state){
			console.log(location.state);
			window.location.pathname = location.state.back;
		}
		else{
			const newState = null;
			const newPath = "/Call";
			history.push(newPath, newState);
		}*/

    //window.location.reload();
  };

  const closeCallingPopup = () => {
    socket.emit("left");
    // Close the calling popup
    setCalling(false);

    // ... (existing code)
  };
  const handleBack = () => {
    window.location.pathname = "/HomePage";
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "royalblue" }}>Calling Room</h1>
      <div>
        <div className="container" style={containerStyles}>
          <div className="video-container" style={{ display: "inline-flex" }}>
            <div className="video">
              {stream && (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: `${videoAsp}px` }}
                />
              )}
            </div>
            <div className="video">
              {callAccepted && !callEnded ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "600px", height: "600px" }}
                />
              ) : null}
            </div>
          </div>
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : null}
          </div>
        </div>
        {/* Calling Popup */}
        <Modal open={calling}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Calling...</h2>
            <Button
              variant="contained"
              color="secondary"
              onClick={closeCallingPopup}
            >
              End Call
            </Button>
          </div>
        </Modal>
        <div className="myId">
          {/* <TextField
				id="filled-basic"
				label="Name"
				variant="filled"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{ marginBottom: "20px" }}
			/> */}
          {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
				<Button variant="contained" color="primary">
					Copy ID
				</Button>
			</CopyToClipboard> */}

          {/* <TextField
				id="filled-basic"
				label="name"
				variant="filled"
				value={idToCall}
				onChange={(e) => setIdToCall(e.target.value)}
				/> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Appointment Id</th>
                  <th>Appointment date</th>
                  <th>Name</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item._id}</td>
                    <td>{item.date}</td>
                    <td>{item.doctorId.name}</td>
                    <td></td>
                    <td></td>

                    <td>
                      <IconButton
                        color="primary"
                        aria-label="call"
                        onClick={() => callUser(item)}
                      >
                        <PhoneIcon fontSize="large" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
        <button
          className="btn btn-primary rounded-2"
          style={{
            position: "fixed",
            bottom: "5%",
            right: "3%",
            width: "5%",
            height: "40px",
          }}
          onClick={handleBack}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default Call;
