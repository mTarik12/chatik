import React from "react";

import "./Chat.style.css";

const ChatComponent = () => {
  return (
    <div className="chat">
      <div className="chat-users">
        <b>Users (1):</b>
        <ul>
          <li>Test User</li>
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
          <textarea className="form-control" rows="3"></textarea>
          <button type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
