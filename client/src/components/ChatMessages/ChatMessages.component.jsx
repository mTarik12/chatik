import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import "./ChatMessage.style.css";

const ChatMessages = ({ user, chatIds, sendMessage, messages }) => {
  const [avatar, setAvatar] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("chatik-user"));
  const chatId = currentUser
    ? chatIds.find(
        (chatId) => chatId.includes(currentUser.id) && chatId.includes(user.id)
      )
    : "";

  const [messageValue, setMessageValue] = useState("");
  const onSendMessage = () => {
    if (messageValue.trim()) {
      sendMessage(messageValue, chatId, user.id);
      setMessageValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(messageValue, chatId, user.id);
      setMessageValue("");
    }
  };

  useEffect(async () => {
    const avatar = await axios.get(
      `http://localhost:8080/${user.userAvatarName}.png`
    );
    await setAvatar(avatar);
  }, []);

  return (
    <div className="chat-messages">
      <div>
        <div>{user.userName}</div>
        <div>
          <img src={avatar.config.url} width="50" height="50" alt="''" />
        </div>
      </div>
      <div className="messages">
        {messages.length
          ? messages.map((message, index) => (
              <div
                className={
                  message.sent
                    ? "sent-message message"
                    : "received-message message"
                }
              >
                <p key={message + index}>{message.text}</p>
              </div>
            ))
          : "No messages yet"}
      </div>
      <div className="send-area">
        <textarea
          className="form-control"
          rows="1.8"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onKeyPress={handleKeyPress}
        ></textarea>
        <button type="button" className="btn" onClick={onSendMessage}>
          Send message
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
