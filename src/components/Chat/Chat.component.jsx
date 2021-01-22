import React from "react";
import { useState, useRef, useEffect } from "react";
import socket from "../../socket";

import "./Chat.style.css";

const ChatComponent = ({ users, messages, userName, chatID, onAddMessage }) => {
  const [messageValue, setmessageValue] = useState("");
  const messagesRef = useRef(null);

  const messagesData = { userName, chatID, text: messageValue };

  const setTimerForSpamBot = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  const sendMessage = () => {
    socket.emit("CHAT:NEW_MESSAGE", messagesData);
    onAddMessage({ userName, text: messageValue });
    setmessageValue("");
  };

  const sendRoboMessage = () => {
    socket.emit("CHAT:ROBO_MESSAGE", messagesData);
    onAddMessage({ userName, text: messageValue });
    onAddMessage({ userName: "Echo bot", text: messageValue });
    setmessageValue("");
  };

  const sendReverseMessage = () => {
    socket.emit("CHAT:REVERSE_MESSAGE", messagesData);
    onAddMessage({ userName, text: messageValue });
    setTimeout(() => {
      onAddMessage({
        userName: "Reverse bot",
        text: messageValue.split("").reverse().join(""),
      });
    }, 3000);
    setmessageValue("");
  };

  const sendRandomMessage = () => {
    const spam = [
      "Good evening",
      "How are you doing?",
      "Good job!",
      "Hi!",
      "Not good...",
      "Let's work!",
      "I want to go home",
      "What is your name?",
      "My name is Spam bot...",
    ];

    socket.emit("CHAT:RANDOM_MESSAGE", messagesData);
    onAddMessage({ userName, text: messageValue });
    setInterval(() => {
      const randomSpam = Math.floor(Math.random() * 9);
      onAddMessage({ userName: "Spam bot", text: spam[randomSpam] });
    }, setTimerForSpamBot(121000, 10000));
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={sendReverseMessage}
          >
            Send Reverse message
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={sendRandomMessage}
          >
            Send Random message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
