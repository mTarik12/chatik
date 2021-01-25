import React from "react";

import ChatListItemComponent from '../ChatListItem/ChatListItem.component';
import "./ChatList.style.css";

const ChatListComponent = ({ setSelectedUser, users }) =>
    <div className="chat-list">
        {Object.values(users).map((user, index) => (
            <div key={index} onClick={(e) => {
                setSelectedUser(user)
            }}>
                <ChatListItemComponent user={user} />
            </div>
        ))}
    </div>

export default ChatListComponent;