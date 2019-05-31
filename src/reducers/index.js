import { LOAD_ITEMS } from '../actions';

import { LOAD_SPECIFIC_ITEM } from '../actions';

import { GRAB_ITEM_IMAGES } from '../actions';

import { LOGIN } from '../actions';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user')),
  item: {},
  items: [],
  images: [],
};

function itemReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ITEMS:
      return Object.assign({}, state, { items: [...action.payload] });

    case LOAD_SPECIFIC_ITEM:
      return Object.assign({}, state, { item: action.payload });

    case GRAB_ITEM_IMAGES:
      return Object.assign({}, state, { images: [...action.payload] });

    case LOGIN:
      return Object.assign({}, state, { currentUser: action.payload });

    default:
      return state;
  }
}

export default itemReducer;
