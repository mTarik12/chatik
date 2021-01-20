import React from 'react';
import { useReducer } from 'react';

import EnterComponent from './components/Enter/Enter.component';
import reducer from './reducer';
import socket from './socket';

import './App.css';


const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
  });

  const onLogin = () => {
    dispatch({
      type: 'JOINED',
      payload: true,
    });
  }
  
  return <div className="wrapper">{!state.isAuth && <EnterComponent onLogin={onLogin} />} </div>
  
}

export default App;
