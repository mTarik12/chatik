import React from 'react';
import io from 'socket.io-client';

function App() {
  const connectSocket = () => io('https://localhost:8080');

  return (
    <div className="App">
      <button onClick={connectSocket}>CONNECT</button>
    </div>
  );
}

export default App;
