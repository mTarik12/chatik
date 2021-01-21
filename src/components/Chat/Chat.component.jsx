import React from "react";
import { useState } from "react";

import "./Chat.style.css";

const ChatComponent = ({ users, messages }) => {
  const [messageValue, setmessageValue] = useState("");

  return (
    <div className="chat">
      <div className="chat-users">
        <b>Online: {users.length}</b>
        <ul>
          {users.map((name) => (
            <li>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages"></div>
        <div className="message">
          <p>Message is here</p>
          <div>
            <span>Test User</span>
          </div>
        </div>
        <form>
          <textarea
            className="form-control"
            rows="3"
            value={messageValue}
            onChange={(e) => setmessageValue(e.target.value)}
          ></textarea>
          <button type="button" className="btn btn-primary">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
