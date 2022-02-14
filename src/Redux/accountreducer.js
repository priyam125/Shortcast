// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT, UPDATE_USER, UPDATE_AVATAR, RECOVERY_EMAIL, UPDATE_GENRE } from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    recoverymail: "",
    userdata: {
        id: "",
        user_id: "",
        email_id: "",
        user_type: "",
        username: "",
        full_name: "",
        bio: "",
        avatar_link: "",
        twitter_handle: "",
        created_on: "",
        updated_on: "",
    },
    issuper: false,
    genre_selected: false
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user, token, genre_selection, issuper } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user,
                genre_selected: genre_selection,
                issuper
            };
        }
        case UPDATE_USER: {
            const { user } = action.payload;
            return {
                ...state,
                userdata: user
            };
        }
        case UPDATE_AVATAR: {
            const { user_avatar } = action.payload;
            return {
                ...state,
                userdata: {
                    ...state.userdata,
                    avatar_link: user_avatar
                }
            };
        }

        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null
            };
        }
        case RECOVERY_EMAIL: {
            const { recoverymail } = action.payload;
            return {
                ...state,
                recoverymail: recoverymail
            };
        }
        case UPDATE_GENRE: {
            console.log(action.payload)
            const { genre_status } = action.payload;

            return {
                ...state,
                genre_selected: genre_status
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
