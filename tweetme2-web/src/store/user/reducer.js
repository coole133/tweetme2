import { NEW_USER } from "./consts";

const initialState = {
    currentUser: {
        user: 'vladyslav',
        canTweet: false
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEW_USER:
            return {
                ...state,
                currentUser: action.payload,
            }
        default :
            return state;
    }
}

export default userReducer