const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const PORT = 8080;

const chat = new Map();

app.get('/chat/:id', (req, res) => {
    const { id: chatID } = req.params;
    console.log(chatID);
    if (chat.has(chatID)) {
        res.send({
            users: [...chat.get(chatID).get('users').values()],
            messages: [...chat.get(chatID).get('messages').values()]
        });
    } else res.send({ users: [], messages: [] });
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
    socket.on('CHAT:JOINED', ({ chatID, userName }) => {
        socket.join(chatID);
        chat.get(chatID).get('users').set(socket.id, userName);
        const users = [...chat.get(chatID).get('users').values()];
        socket.to(chatID).broadcast.emit('CHAT:SET_USERS', users);
    });

    socket.on('CHAT:NEW_MESSAGE', ({ chatID, userName, text }) => {
        const messageData = {
            userName,
            chatID,
            text
        };
        chat.get(chatID).get('messages').push(messageData);
        socket.to(chatID).broadcast.emit('CHAT:NEW_MESSAGE', messageData);
    });

    socket.on('CHAT:ROBO_MESSAGE', ({ chatID, userName, text }) => {
        const messageData = {
            userName,
            chatID,
            text
        };
        chat.get(chatID).get('messages').push(messageData);
        socket.to(chatID).broadcast.emit('CHAT:ROBO_MESSAGE', messageData);
    });

    socket.on('CHAT:REVERSE_MESSAGE', ({ chatID, userName, text }) => {
        const messageData = {
            userName,
            chatID,
            text
        };
        chat.get(chatID).get('messages').push(messageData);
        socket.to(chatID).broadcast.emit('CHAT:REVERSE_MESSAGE', messageData);
    });

    socket.on('disconnect', () => {
        chat.forEach((value, chatID) => {

            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.to(chatID).broadcast.emit('CHAT:SET_USERS', users);
            }
        });
    });

    console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {

    if (err) {
        throw Error(err);
    }
    console.log(`Server is listening on port ${PORT}`);
});