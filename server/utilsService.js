const { v4: uuidv4 } = require('uuid');

const avatarNames = ['a', 'b', 'c', 'd', 'e'];
const names = [
    'John', 'Emily', 'Edik', 'Andry', 'Leo'
];

module.exports = {
    generateNewUser: () => {
        const random = Math.floor(Math.random() * avatarNames.length);
        return {
            id: uuidv4(),
            userName: names[Math.floor(Math.random() * names.length)],
            userAvatarName: avatarNames[random]
        }
    }
}


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
