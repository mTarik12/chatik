import React from 'react';
import io from 'socket.io-client';

const App = () => {
  const connectSocket = () => io();

  return (
     <div>
		 <button onClick={connectSocket}>Connect</button>
    </div>
  );
}

export default App;
