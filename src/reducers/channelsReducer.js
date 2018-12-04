// channelsReducer
import {
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
  SET_USER_POSTS
} from '../actions/types';

const initialState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
};

const channelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      };

    default:
      return state;
  }
};

export default channelsReducer;
