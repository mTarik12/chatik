const express = require('express');
const cors = require('cors');

const app = express();

// app.use(require('cors'));

const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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