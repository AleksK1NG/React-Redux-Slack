import { SET_COLORS } from '../actions/types';

const initialState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee'
};

const colorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };

    default:
      return state;
  }
};

export default colorsReducer;