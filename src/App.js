import React from 'react';
import { useReducer, useEffect } from 'react';
import axios from 'axios';

import EnterComponent from './components/Enter/Enter.component';
import ChatComonent from './components/Chat/Chat.component';
import reducer from './reducer';
import socket from './socket';

import './App.css';


const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    chatID: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (userData) => {
    dispatch({
      type: 'JOINED',
      payload: userData,
    });
    socket.emit('CHAT:JOINED', userData);

    const { data } = await axios.get(`/chat/${userData.chatID}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
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

  useEffect(() => {
    socket.on('CHAT:SET_USERS', setUsers);
    socket.on('CHAT:NEW_MESSAGE', addMessage);
    socket.on('CHAT:ROBO_MESSAGE', addMessage);
    socket.on('CHAT:REVERSE_MESSAGE', addMessage);
    socket.on('CHAT:RANDOM_MESSAGE', addMessage);
    socket.on('CHAT:IGNORE_MESSAGE', addMessage);
  }, []);


  return <div className="wrapper">{!state.joined ? <EnterComponent onLogin={onLogin} /> : <ChatComonent {...state} onAddMessage={addMessage} />} </div>

}

export default App;
