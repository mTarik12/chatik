const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["*"],
        allowedHeaders: ["*"],
    }
});

const { generateNewUser } = require('./utilsService');

//app.use(express.json());

const PORT = 8080;
server.listen(PORT, (err) => {

    if (err) {
        throw Error(err);
    }
    console.log(`Server is listening on port ${PORT}`);
});

const chat = {};

app.options("/*", function (req, res, next) {
    setAccessHeaders(res);
    res.send(200);
});

app.use((req, res, next) => {
    setAccessHeaders(res);
    next();
});

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

app.get('/chats', (req, res) => {

    //TODO fix naming
    res.send({ users: chat });
});



io.on('connection', socket => {


    socket.on('CONNECT_USER_TO_ALL_CHATS', ({ user }) => {
        console.log('user', user, 'chat', chat)
        if (chat[user.id]) {
            chat[user.id].online = true;
            chat[user.id].sessionId = socket.id;
            socket.broadcast.emit('USERS_LIST_CHANGED', { chat });
        };

        connectUserToAllChats(socket, chat, user);
    })

    socket.on('GENERATE_NEW_USER', () => {
        const user = generateNewUser();

        socket.emit('USER_GENERATED', { user });

        connectUserToAllChats(socket, chat, user);

        // add this user to chat (db)
        if (!chat[user.id]) {
            chat[user.id] = { ...user, online: true, sessionId: socket.id };
            socket.broadcast.emit('USERS_LIST_CHANGED', { chat });
        };
    })

    socket.on('JOIN_CHAT', ({ newChatId }) => {
        console.log('join chat  client', newChatId)
        socket.join(newChatId);
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

    socket.on('CHAT:RANDOM_MESSAGE', ({ chatID, userName, text }) => {
        const messageData = {
            userName,
            chatID,
            text
        };
        chat.get(chatID).get('messages').push(messageData);
        socket.to(chatID).broadcast.emit('CHAT:RANDOM_MESSAGE', messageData);
    });

    socket.on('CHAT:IGNORE_MESSAGE', ({ chatID, userName, text }) => {
        const messageData = {
            userName,
            chatID,
            text
        };
        chat.get(chatID).get('messages').push(messageData);
        socket.to(chatID).broadcast.emit('CHAT:IGNORE_MESSAGE', messageData);
    });

    socket.on('disconnect', () => {
        Object.keys(chat).forEach(userKey => {
            if (chat[userKey].sessionId === socket.id) {
                chat[userKey].online = false;
                chat[userKey].sessionId = null;
            };
        });
        socket.broadcast.emit('USERS_LIST_CHANGED', { chat });
    });


});

function setAccessHeaders(res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
}

function connectUserToAllChats(socket, chat, user) {
    const newChatIds = [];

    Object.keys(chat).forEach(connectedUserId => {
        const newChatId = `${connectedUserId}_${user.id}`;
        newChatIds.push(newChatId);
        // create new room and join
        socket.join(newChatId);
    });

    socket.broadcast.emit('USERS_LIST_CHANGED', { chat });
    socket.broadcast.emit('NEW_USER_JOINED', { newUser: user, newChatIds });
    console.log('newChatIds',newChatIds)
}