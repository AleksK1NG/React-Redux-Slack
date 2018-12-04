import { combineReducers } from 'redux';
import userReducer from './userReducer';
import channelsReducer from './channelsReducer';
import colorsReducer from './colorsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelsReducer,
  colors: colorsReducer
});

export default rootReducer;

