import React from 'react';
import { useReducer, useEffect } from 'react';

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

  const onLogin = (userData) => {
    dispatch({
      type: 'JOINED',
      payload: userData,
    });
    socket.emit('CHAT:JOINED', userData)
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  }

  useEffect(() => {
    socket.on('CHAT:IN', setUsers);
    socket.on('CHAT:SET_USERS', setUsers);
  }, []);


  return <div className="wrapper">{!state.joined ? <EnterComponent onLogin={onLogin} /> : <ChatComonent {...state} />} </div>

}

export default App;
