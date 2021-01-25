const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
  },
});
const { generateNewUser } = require("./utilsService");

const spam = [
  "Good evening",
  "How are you doing?",
  "Good job!",
  "Hi!",
  "Not good...",
  "Let's work!",
  "I want to go home",
  "What is your name?",
  "My name is Spam bot...",
];

const IDS = {
  ECHO_BOT_ID: "ECHO-BOT-ID",
  REVERSE_BOT_ID: "REVERSE-BOT-ID",
  SPAM_BOT_ID: "SPAM-BOT-ID",
  IGNORE_BOT_ID: "IGNORE-BOT-ID",
};

const chat = {
  [IDS.ECHO_BOT_ID]: {
    online: true,
    sessiondId: "online",
    id: IDS.ECHO_BOT_ID,
    userAvatarName: "echo_avatar",
    userName: "Echo bot",
  },
  [IDS.REVERSE_BOT_ID]: {
    online: true,
    sessiondId: "online",
    id: IDS.REVERSE_BOT_ID,
    userAvatarName: "reverse_avatar",
    userName: "Reverse bot",
  },
  [IDS.SPAM_BOT_ID]: {
    online: true,
    sessiondId: "online",
    id: IDS.SPAM_BOT_ID,
    userAvatarName: "spam_avatar",
    userName: "Spam bot",
  },
  [IDS.IGNORE_BOT_ID]: {
    online: true,
    sessiondId: "online",
    id: IDS.IGNORE_BOT_ID,
    userAvatarName: "ignore_avatar",
    userName: "Ignore bot",
  },
};

let global_chatIds = [];

const PORT = 8080;
server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`Server is listening on port ${PORT}`);
});

app.options("/*", function (req, res, next) {
  setAccessHeaders(res);
  res.send(200);
});

app.use((req, res, next) => {
  setAccessHeaders(res);
  next();
});
app.use(express.static("public"));

// app.get("/avatar/:id", (req, res) => {
//   const { id: chatID } = req.params;
//   console.log(chatID);
//   if (chat.has(chatID)) {
//     res.send({
//       users: [...chat.get(chatID).get("users").values()],
//       messages: [...chat.get(chatID).get("messages").values()],
//     });
//   } else res.send({ users: [], messages: [] });
// });

app.get("/chats", (req, res) => {
  //TODO fix naming
  res.send({ users: chat });
});

const getRandomTimeout = () => {
  const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
  return getRandomArbitrary(10, 120) * 1000;
};

const sendSpam = (socket) => {
  const timeoutId = setTimeout(() => {
    socket.emit("MESSAGE_RECEIVED", {
      text: spam[Math.floor(Math.random() * 9)],
      senderId: IDS.SPAM_BOT_ID,
    });
    clearTimeout(timeoutId);
    sendSpam(socket);
  }, getRandomTimeout());
};

io.on("connection", (socket) => {
  sendSpam(socket);

  socket.on("CONNECT_USER_TO_ALL_CHATS", ({ user }) => {
    if (!chat[user.id]) {
      chat[user.id] = user;
      socket.broadcast.emit("USERS_LIST_CHANGED", { chat });
    }
    console.log("user", user, "chat", chat);
    if (chat[user.id]) {
      chat[user.id].online = true;
      chat[user.id].sessionId = socket.id;
      socket.broadcast.emit("USERS_LIST_CHANGED", { chat });
    }

    connectUserToAllChats(socket, chat, user);
  });

  socket.on("GENERATE_NEW_USER", () => {
    const user = generateNewUser();

    socket.emit("USER_GENERATED", { user });

    connectUserToAllChats(socket, chat, user);

    // add this user to chat (db)
    if (!chat[user.id]) {
      chat[user.id] = { ...user, online: true, sessionId: socket.id };
      socket.broadcast.emit("USERS_LIST_CHANGED", { chat });
    }
  });

  socket.on("JOIN_CHAT", ({ newChatId }) => {
    console.log("join chat  client", newChatId);
    socket.join(newChatId);
  });

  socket.on("MESSAGE_SENT", ({ chatId, text, senderId }) => {
    switch (chatId.replace(senderId, "").replace("_", "")) {
      case IDS.ECHO_BOT_ID:
        socket.emit("MESSAGE_RECEIVED", { text, senderId: IDS.ECHO_BOT_ID });
        break;
      case IDS.REVERSE_BOT_ID:
        setTimeout(() => {
          socket.emit("MESSAGE_RECEIVED", {
            text: text.split("").reverse().join(""),
            senderId: IDS.REVERSE_BOT_ID,
          });
        }, 3000);
        break;

      default:
        socket.to(chatId).emit("MESSAGE_RECEIVED", { text, senderId });
    }
  });

  socket.on("disconnect", () => {
    Object.keys(chat).forEach((userKey) => {
      if (chat[userKey].sessionId === socket.id) {
        chat[userKey].online = false;
        chat[userKey].sessionId = null;
      }
    });
    socket.broadcast.emit("USERS_LIST_CHANGED", { chat });
  });
});

function setAccessHeaders(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
}

function connectUserToAllChats(socket, chat, user) {
  const newChatIds = [];

  Object.keys(chat).forEach((connectedUserId) => {
    if (connectedUserId === user.id) {
      return;
    }
    const newChatId = `${connectedUserId}_${user.id}`;
    newChatIds.push(newChatId);
    // create new room and join
    socket.join(newChatId);
  });

  socket.broadcast.emit("USERS_LIST_CHANGED", { chat });
  socket.broadcast.emit("NEW_USER_JOINED", { newUser: user, newChatIds });

  global_chatIds = Array.from(new Set([...global_chatIds, ...newChatIds]));
  console.log("global_chatIds BE:", global_chatIds);

  io.emit("CHAT_IDS_ADDED", { global_chatIds });
}
