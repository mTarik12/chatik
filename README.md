Chrome browser is basic for "chatik" usage.
Please use this reference to start using "chatik":

1. Download repo.
2. Make sure you have node.js installed on your laptop.
3. Run `npm i` in server folder to install all dependencies on back-end side
4. Run `npm i` in client folder to install all dependencies on fron-end side.
5. `npm run server` to start server.
6. `npm run start` to start using "chatik".
7. If it is not autorun, go to http://localhost:3000/.
8. Enjoy:)

-------------**outro**--------------
##If I had more time I would:

1. take care about UI more carefully (program logic implement took far more time than I expected):

- "User is typing..." when someone started to type. I wanted to use socket.io emit method to implement this feature.

- Visible and nice scroll for messages.

- Better images for users.

- Received and sent messages with visible information about user who sent it and time and date when it was sent.

- And just better ui for eyes looking.

2. Some logic implements:

- useRef() React Hook to show the last message in moment it received.

- Using async await getting pictures only one time in one main component, without parallel components for one way data flow.

3. Better code structure with more modules and components. Especially in server side.
