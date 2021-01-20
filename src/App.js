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
  });

  const onLogin = (userData) => {
    dispatch({
      type: 'JOINED',
      payload: userData,
    });
    socket.emit('CHAT:JOINED', userData)
  };

  useEffect(() => {
    socket.on('CHAT:IN', (users) => {
      console.log('new user', users);
    });
  }, []);


  return <div className="wrapper">{!state.joined ? <EnterComponent onLogin={onLogin} /> : <ChatComonent /> } </div>

}

export default App;
