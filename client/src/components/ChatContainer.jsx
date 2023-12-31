import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
//import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await axios.get(`http://localhost:8000/patient/byId`);
        setCurrentUser(user.data);

        const response = await axios.get(`http://localhost:8000/chat/${currentUser._id}/${currentChat._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (currentChat) {
      fetchData();
    }
  }, [currentChat, currentUser]);



  const handleSendMsg = async (msg) => {
    try {
      if (!currentUser || !currentChat) {
        console.error("Error: currentUser or currentChat is undefined");
        return;
      }
  
      console.log(currentChat._id);
      console.log(currentUser._id);
  
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        msg,
      });
  
      await axios.post(`http://localhost:8000/chat/createMessage`, {
        senderId: currentUser._id,
        receiverId: currentChat._id,
        content: msg,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
          <h3>{'\u00a0'.repeat(55)}{currentChat.name}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 20px; /* Adjust the radius value as needed */
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

  

      .username {
        display: flex; /* Ensure it's a flex container */
        align-items: center;
        flex-direction: column;
        h3 {
          color: black;
          margin:0;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #ffffff;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #3366CC;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #aaaaaa;
      }
    }
  }
`;
