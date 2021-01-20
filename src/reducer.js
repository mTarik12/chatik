import { act } from "react-dom/test-utils";

export default (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                joined: true,
                chatID: action.payload.chatID,
                userName: action.payload.userName,
            };
        default:
            return state;
    }
}