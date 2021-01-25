import React, { useState } from 'react';
import { useReducer, useEffect } from 'react';
import axios from 'axios';

import ChatComonent from './components/Chat/Chat.component';
import reducer from './reducer';
import socket from './socket';

import './App.css';

const App = () => {
  let user = {};
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    chatID: null,
    userName: null,
    users: {},
    messages: [],
    chatIds: []
  });

  const [searchValue, setSearchValue] = useState('')

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  }
  const onEnter = async () => {
    user = JSON.parse(localStorage.getItem('chatik-user'));
    if (!user) {
      socket.emit('GENERATE_NEW_USER');
    } else {
      socket.emit('CONNECT_USER_TO_ALL_CHATS', { user });
    };
    const res = await axios.get("http://localhost:8080/chats");

    user && delete res.data.users[user.id]

    setUsers(res.data.users)
  };

  const onNewUserJoined = ({ newUser }) => {
    const newChatId = `${user.id}_${newUser.id}`;
    socket.emit("JOIN_CHAT", { newChatId });
  };


  const onUserGenerated = ({ user: generatedUser }) => {
    user = generatedUser;
    localStorage.setItem('chatik-user', JSON.stringify(generatedUser));
  };

  const onUserListChanged = ({ chat }) => {
    delete chat[user.id];
    setUsers({ ...state.users, ...chat })
  };
  const onChatIdsAdded = ({ global_chatIds }) => {
    dispatch({
      type: 'SET_CHAT_IDS',
      payload: global_chatIds,
    });
  };

  useEffect(() => {
    onEnter();
    socket.on('NEW_USER_JOINED', onNewUserJoined);
    socket.on('USER_GENERATED', onUserGenerated);
    socket.on('USERS_LIST_CHANGED', onUserListChanged);
    socket.on('CHAT_IDS_ADDED', onChatIdsAdded);

  }, []);

  const getFilteredUsers = (stateUsers, searchValue) => {
    const users = JSON.parse(JSON.stringify(stateUsers));
    Object.keys(users).forEach(userKey => {
      if (!users[userKey].userName.toLowerCase().includes(searchValue.toLowerCase())) {
        delete users[userKey];
      };
    });
    return users;
  };
  return <div className="wrapper">
    <ChatComonent {...state}
      users={getFilteredUsers(state.users, searchValue)}
      searchValue={searchValue}
      setSearchValue={setSearchValue} />


  </div>

}

export default App;
