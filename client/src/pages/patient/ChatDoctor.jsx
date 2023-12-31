import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../../components/ChatContainer";
import Contacts from "../../components/Contacts";
import Welcome from "../../components/Welcome";
import AppBar from "@mui/material/AppBar";
import ResponsiveAppBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";

export default function ChatDoctor() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:9000/patient/byId`);
        setCurrentUser(result.data);
        console.log(result.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const connectSocket = async () => {
      if (currentUser) {
        socket.current = io("http://localhost:9000");
        socket.current.emit("add-user", currentUser._id);
      }
    };
    connectSocket();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const doctorResponse = await axios.get(`http://localhost:8000/doctor/`);
        setContacts(doctorResponse.data);

      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser) {
      fetchUsersList();
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <div style={{ display: "inline-flex" }}>
      <div
        className="card m-3 col-12"
        style={{
          width: "80%",
          borderRadius: "20px",
          left: "8%",
          display: "flex",
        }}
      >
        <AppBar
          style={{
            height: "100%",
            backgroundColor: "#F0F0F0",
            overflowY: "auto",
          }}
        >
          <ResponsiveAppBar />
          <p></p>
          <Container>
            <div className="container">
              <Contacts contacts={contacts} changeChat={handleChatChange} />
              {currentChat === undefined ? (
                <Welcome />
              ) : (
                <ChatContainer currentChat={currentChat} socket={socket} />
              )}
            </div>
          </Container>
          <BottomBar />
        </AppBar>
      </div>
    </div>
  );
}

const Container = styled.div`
  max-width: 90%;
  margin: 0 auto;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
  overflow: hidden;

  .container {
    height: 95vh;
    width: 95vw;
    background-color: #ffffff;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
