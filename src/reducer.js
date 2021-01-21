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

        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            };

        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        default:
            return state;
    }
}