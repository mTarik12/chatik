import React from "react";
import { useState } from "react";

import "./Chat.style.css";

const ChatMessages = ({ user, chatIds, sendMessage, messages }) => {
    const currentUser = JSON.parse(localStorage.getItem('chatik-user'));
    const chatId = currentUser
        ? chatIds.find(chatId => chatId.includes(currentUser.id) && chatId.includes(user.id))
        : '';

    const [messageValue, setMessageValue] = useState('');
    const onSendMessage = () => {
        if (messageValue.trim()) {
            sendMessage(messageValue, chatId, user.id)
            setMessageValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(messageValue, chatId, user.id)
            setMessageValue('');
        }
    };
    return <div className="chat-messages">
        <div>
            {user.userName}
        </div>
        <div className="messages" >
            {messages.length ? messages.map((message, index) => (
                <div className={message.sent ? 'sent-message message' : 'received-message message'}>
                    <p key={message + index}>{message.text}</p>
                </div>
            ))
                : 'No messages yet'}
        </div>
        <form>
            <textarea
                className="form-control"
                rows="3"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                onKeyPress={handleKeyPress}
            ></textarea>
            <button
                type="button"
                className="btn btn-primary"
                onClick={onSendMessage}
            >
                Send message
      </button>
        </form>
    </div>
}

export default ChatMessages;