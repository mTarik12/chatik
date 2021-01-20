import React, { useState } from "react";
import socket from "../../socket";
import axios from "axios";

import "./Enter.style.css";

const EnterComponent = ({ onLogin }) => {
  const [chatID, setChatID] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!chatID || !userName) {
      return alert("Incorrect data");
    }

    setIsLoading(true);

    await axios.post("/chat", {
      chatID,
      userName,
    });
    onLogin();
  };

  return (
    <div className="enter-block">
      <input
        type="text"
        placeholder="Join chat"
        value={chatID}
        onChange={(e) => setChatID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button disabled={isLoading} className="btn" onClick={onEnter}>
        {isLoading ? "Connection..." : "CONNECT"}
      </button>
    </div>
  );
};

export default EnterComponent;
