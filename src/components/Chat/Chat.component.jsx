import React from "react";
import { useState, useRef, useEffect } from "react";
import socket from "../../socket";

import "./Chat.style.css";

const ChatComponent = ({
  users,
  messages,
  userName,
  chatID,
  onAddMessage,
  onAddRoboMessage,
}) => {
  const [messageValue, setmessageValue] = useState("");
  const messagesRef = useRef(null);

  const sendMessage = () => {
    socket.emit("CHAT:NEW_MESSAGE", {
      userName,
      chatID,
      text: messageValue,
    });
    onAddMessage({ userName, text: messageValue });
    setmessageValue("");
  };

  const sendRoboMessage = () => {
    socket.emit("CHAT:ROBO_MESSAGE", {
      userName,
      chatID,
      text: messageValue,
    });
    onAddRoboMessage({ userName, text: messageValue });
    onAddRoboMessage({ userName, text: messageValue });
    setmessageValue("");
  };

  useEffect(() => {
    messagesRef.current.scrollTo(0, 9999999);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        Chat: <b>{chatID}</b>
        <hr />
        <b>Online: {users.length}</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages" ref={messagesRef}>
          {messages.map((messages, index) => (
            <div className="message">
              <p key={messages + index}>{messages.text}</p>
              <div>
                <span key={messages.userName + index}>{messages.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            className="form-control"
            rows="3"
            value={messageValue}
            onChange={(e) => setmessageValue(e.target.value)}
          ></textarea>
          <button
            type="button"
            className="btn btn-primary"
            onClick={sendMessage}
          >
            Send message
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={sendRoboMessage}
          >
            Send Robo message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
