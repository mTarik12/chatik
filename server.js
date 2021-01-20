const express = require('express');
const cors = require('cors');
const { json } = require('express');

const app = express();

app.use(express.json());

const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 8080;

const chat = new Map();

app.get('/chat', (req, res) => {
    res.json(chat);
});

app.post('/chat', (req, res) => {
    const { chatID, userName } = req.body;

    if (!chat.has(chatID)) {
        chat.set(chatID, new Map([
            ['users', new Map()],
            ['messages', []],
        ]),
        );
    }
    res.send();
});

io.on('connection', socket => {
    socket.on('CHAT:JOINED', ({chatID, userName}) => {
       socket.join(chatID);
       chat.get(chatID).get('users').set(socket.id, userName);
       const users = chat.get(chatID).get('users').values();
       socket.to(chatID).broadcast.emit('CHAT:IN', ...users);
    });

    console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {

    if (err) {
        throw Error(err);
    }
    console.log(`Server is listening on port ${PORT}`);
});