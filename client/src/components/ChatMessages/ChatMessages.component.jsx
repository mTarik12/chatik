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
      <div className="top-user">
        {avatar.config && (
          <img src={avatar.config.url} width="120" height="120" alt="''" />
        )}
        <div className="top-text-user">
          <b>{user.userName}</b>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
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
        <input
          className="form-control"
          placeholder="Start chating!"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          onKeyPress={handleKeyPress}
        ></input>
        <button type="button" className="btn" onClick={onSendMessage}>
          Send message
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
