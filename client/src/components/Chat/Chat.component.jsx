import React from "react";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import socket from "../../socket";

import "./Chat.style.css";
import ChatMessages from '../ChatMessages/ChatMessages.component';
import ChatList from '../ChatsList/ChatsList.component';


// TODO fix users, user
const ChatComponent = ({ users, chatID, chatIds, searchValue, setSearchValue }) => {
  const currentUser = JSON.parse(localStorage.getItem('chatik-user'));
  const [selectedUser, setSelectedUser] = useState();
  const [messages, setMessages] = useState({});

  const sendMessage = (messageValue, chatId, receiverId) => {
    socket.emit('MESSAGE_SENT', { text: messageValue, chatId, senderId: currentUser.id });
    const userMessages = messages[receiverId] ? messages[receiverId] : [];
    setMessages({
      ...messages,
      ...{ [receiverId]: [...userMessages, { text: messageValue, sent: true }] }
    });
  };

  const onReceivedMessage = ({ text, senderId }) => {
    console.log('received', text, senderId)
    const userMessages = messages[senderId] ? messages[senderId] : [];
    setMessages({
      ...messages,
      ...{ [senderId]: [...userMessages, { text, sent: false }] }
    });
  };

  useEffect(() => {
    socket.on('MESSAGE_RECEIVED', onReceivedMessage);
  }, [messages]);

  const getOnlineUsers = stateUsers => {
    const users = JSON.parse(JSON.stringify(stateUsers));
    Object.keys(users).forEach(userKey => {
      if (!users[userKey].online) {
        delete users[userKey];
      };
    });
    return users;
  };

  return (
    <div className="chat">

      {selectedUser
        ? <ChatMessages user={selectedUser}
          chatIds={chatIds}
          sendMessage={sendMessage}
          messages={messages[selectedUser.id]
            ? messages[selectedUser.id]
            : []} />
        : <div className="chat-messages">Select chat</div>}

      <div className="chat-users" >
        <Tabs>
          <TabList>
            <Tab>Online</Tab>
            <Tab>All</Tab>
          </TabList>

          <TabPanel>
            <ChatList users={getOnlineUsers(users)} setSelectedUser={setSelectedUser} />
          </TabPanel>
          <TabPanel>
            <ChatList users={users} setSelectedUser={setSelectedUser} />
          </TabPanel>
        </Tabs>
        <div>
          <input
            className="form-control"
            placeholder="Search..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
