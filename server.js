const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 8080;

// const users = {
//     username: [],
//     userPhoto: [],
//     userMessage: []
// }

app.use(express.json());

app.get('/chut', (req, res) => {
    res.send(req.body);
});

io.on('connection', socket => {
    console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {
    
    if (err) {
        throw Error(err);
    }
    console.log(`Server is listening on port ${PORT}`);
});