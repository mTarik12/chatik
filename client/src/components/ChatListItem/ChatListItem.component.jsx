import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./ChatListItem.style.css";

const ChatListItemComponent = ({ user }) => {
  const [avatar, setAvatar] = useState("");

  useEffect(async () => {
    const avatar = await axios.get(
      `http://localhost:8080/${user.userAvatarName}.png`
    );
    await setAvatar(avatar);
  }, []);

  return (
    <div className="user-item">
      <div>
        {avatar.config && (
          <img src={avatar.config.url} width="50" height="50" alt="''" />
        )}
        {user.online && (
          <svg height="30" width="30">
            <circle cx="5" cy="20" r="5" fill="green"></circle>
          </svg>
        )}
      </div>
      <div>
        <div>
          <b>{user.userName}</b>
        </div>
      </div>
    </div>
  );
};

export default ChatListItemComponent;
