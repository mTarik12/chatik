const { v4: uuidv4 } = require('uuid');

const avatarNames = ['a', 'b', 'c', 'd', 'e'];

module.exports = {
    generateNewUser: () => {
        const random = Math.floor(Math.random() * avatarNames.length);
        const u =  {
            id: uuidv4(),
            userName: makeid(9),
            userAvatarName: avatarNames[random]
        }
        console.log('generate new user',u);
        return u;
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
