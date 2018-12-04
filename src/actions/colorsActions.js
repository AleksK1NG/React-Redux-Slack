import { SET_COLORS } from './types';

export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: SET_COLORS,
    payload: { primaryColor, secondaryColor }
  };
};

