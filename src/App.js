import React from 'react';
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
  });

  const onLogin = async (userData) => {
    // dispatch({
    //   type: 'JOINED',
    //   payload: userData,
    // });
    // //socket.emit('CHAT:JOINED', userData);

    // const { data } = await axios.get(`/chat/${userData.chatID}`);
    // dispatch({
    //   type: 'SET_DATA',
    //   payload: data,
    // });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  }

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
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

  useEffect(() => {
    onEnter();
    // socket.on('CHAT:SET_USERS', setUsers);
    // socket.on('CHAT:NEW_MESSAGE', addMessage);
    // socket.on('CHAT:ROBO_MESSAGE', addMessage);
    // socket.on('CHAT:REVERSE_MESSAGE', addMessage);
    // socket.on('CHAT:RANDOM_MESSAGE', addMessage);
    // socket.on('CHAT:IGNORE_MESSAGE', addMessage);
    // socket.on('CHAT:IGNORE_MESSAGE', addMessage);

    socket.on('NEW_USER_JOINED', onNewUserJoined);
    socket.on('USER_GENERATED', onUserGenerated);
    socket.on('USERS_LIST_CHANGED', onUserListChanged);

  }, []);


  return <div className="wrapper">
    <ChatComonent {...state} onAddMessage={addMessage} />

    {/* {Object.keys(state.users).map(userKey => {
      <ChatComonent {...state} user={state.users[userKey]} onAddMessage={addMessage} />
    })} */}
  </div>

}

export default App;
