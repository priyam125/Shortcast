//Base URL
export const BASE_URL = `${process.env.REACT_APP_TEST_BASE_URL}`

//To fetch images
export const SPLASH_API = `https://api.unsplash.com/search/photos/`

//upload audio
export const UPLOAD_AUDIO = `${process.env.REACT_APP_TEST_UPLOAD_URL}`


export const UPLOAD_POST = `${BASE_URL}/api/podcast/create-post/`
export const DISCOVER_FEED = `${BASE_URL}/api/podcast/discover-feed/`
export const THREAD_POSTS = `${BASE_URL}/api/podcast/fetch-post/`
export const FETCH_COMMENTS = `${BASE_URL}/api/podcast/fetch-comments/`
export const SIGNUP_URL = `${BASE_URL}/api/user/register/`
export const LOGIN_URL = `${BASE_URL}/api/user/login/`
export const USER_PROFILE = `${BASE_URL}/api/user/profile/`
export const USER_POSTS = `${BASE_URL}/api/user/user-posts/`
export const FETCH_PROFILE_DETAILS = `${BASE_URL}/api/user/profile/`
export const EDIT_PROFILE = `${BASE_URL}/api/user/edit-profile/`
export const LIKED_POST = `${BASE_URL}/api/podcast/like-post/`
export const SHARE_POST = `${BASE_URL}/api/podcast/share-post/`
export const PLAYED_POST = `${BASE_URL}/api/podcast/played-post/`
export const FIND_USERNAME = `${BASE_URL}/api/user/find-username/`


export const FEEDBACK = `${BASE_URL}/api/user/feedback/`
export const ADD_BOOKMARK = `${BASE_URL}/api/podcast/bookmark-post/`
export const REMOVE_BOOKMARK = `${BASE_URL}/api/podcast/remove-bookmark/`
export const DELETE_POST = `${BASE_URL}/api/podcast/delete-posts/`
export const ARCHIVE_POST = `${BASE_URL}/api/podcast/archive-post/`
export const GET_BOOKMARK = `${BASE_URL}/api/podcast/get-bookmarks/`



export const FOLLOW = `${BASE_URL}/api/user/follow/`
export const UNFOLLOW = `${BASE_URL}/api/user/unfollow/`


export const SEND_OTP = `${BASE_URL}/api/user/send-otp/`
export const CHECK_OTP = `${BASE_URL}/api/user/check-otp/`
export const RESET_PASSWORD = `${BASE_URL}/api/user/reset-password/`
export const GOOGLE_LOGIN =  `${BASE_URL}/api/social_auth/google/`
export const FACEBOOK_LOGIN =  `${BASE_URL}/api/social_auth/facebook/`



export const UPLOAD_EXCEL =  `${BASE_URL}/api/adminapp/upload-excel/`

export const GET_GENRES =  `${BASE_URL}/api/podcast/get-genre/` 
export const POST_GENRES =  `${BASE_URL}/api/podcast/add-user-genre/`

export const LISTEN_NOTES_BASE_URL = `https://listen-api.listennotes.com/api/v2/`
export const LISTEN_NOTES_GET_PODCASTS = `${LISTEN_NOTES_BASE_URL}search/`
export const LISTEN_NOTES_GET_GENRES = `${LISTEN_NOTES_BASE_URL}genres/`

export const LISTEN_NOTES_GET_DUMMY_USERS = `${BASE_URL}/api/adminapp/get-dummy-users/`
export const LISTEN_NOTES_POST_LISTEN_NOTES = `${BASE_URL}/api/podcast/create-bulk-post/`



