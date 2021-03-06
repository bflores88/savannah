import { combineReducers } from 'redux';

import {
  SEARCH_ITEMS,
  LOAD_ITEMS,
  LOAD_ITEMS_BY_CATEGORY,
  LOAD_SINGLE_USER,
  POST_NEW_MESSAGE,
  LOAD_ALL_ACTIVE_ITEMS,
  LOAD_ACTIVE_ITEMS,
  LOAD_INACTIVE_ITEMS,
  LOAD_SPECIFIC_ITEM,
  ADMIN_USER_EDIT,
  ADMIN_ITEM_EDIT,
  ADD_CATEGORY,
  ADD_SUBCATEGORY,
  GRAB_ALL_PAYMENTS,
  UPDATE_PRIMARY_PAYMENT,
  UPDATE_PRIMARY_ADDRESS,
  REMOVE_ADDRESS,
  GRAB_STATES,
  ADD_ADDRESS,
} from '../actions';

import { GRAB_ITEM_IMAGES } from '../actions';
import { ADD_ITEM } from '../actions';
import { LOAD_CATEGORIES } from '../actions';

import { RESET_NEW_ITEM } from '../actions';
import { INCREMENT_ITEM_VIEWS } from '../actions';
import { UPDATE_USER_PASSWORD } from '../actions';
import { UPDATE_USER } from '../actions';
import { DEACTIVATE_USER } from '../actions';

import { GRAB_USER_THREADS } from '../actions';
import { GRAB_THREAD_MESSAGES } from '../actions';

import { UPDATE_CHOSEN_CATEGORY } from '../actions';
import { UPDATE_CHOSEN_SUBCATEGORY } from '../actions';

import { GRAB_ALL_USERS, GRAB_USERNAME } from '../actions';

import { REGISTER, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../actions';

import { GRAB_USER_CART } from '../actions';
import { DELETE_ITEM_FROM_CART } from '../actions';
import { GRAB_SHIPPING } from '../actions';
import { GRAB_SHIPPING_PRIMARY } from '../actions';
import { GRAB_PAYMENTS } from '../actions';
import { GRAB_USER_SALES } from '../actions';
import { GRAB_USER_ORDERS } from '../actions';
// import { POST_NEW_ORDER } from '../actions';

const initialState = {
  searchResults: [],
  item: {},
  allActiveItems: [],
  items: [],
  images: [],
  newestItem: '',
  threads: [],
  messages: [],
  categories: [],
  itemsByCategory: [],
  userList: [],
  activeItems: [],
  inactiveItems: [],
  username: '',
  chosen_category: '',
  chosen_subcategory: '',
  cart_items: [],
  shipping: [],
  payments: [],
  shippingPrimary: [],
  newCategory: '',
  newSubcategory: '',
  sales: [],
  removedAddress: '',
  states: [],
  orders: [],
};

const userState = {
  registrationSuccessful: false,
  loggedIn: false,
  user: JSON.parse(localStorage.getItem('user')),
  passwordUpdateStatus: false,
  updatedUser: {},
};

function itemReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ITEMS:
      return Object.assign({}, state, { searchResults: [...action.payload] });

    case LOAD_ITEMS:
      return Object.assign({}, state, { items: [...action.payload] });

    case LOAD_ALL_ACTIVE_ITEMS:
      return Object.assign({}, state, { allActiveItems: [...action.payload] });

    case LOAD_SPECIFIC_ITEM:
      return Object.assign({}, state, { item: action.payload });

    case LOAD_ACTIVE_ITEMS:
      return Object.assign({}, state, { activeItems: action.payload });

    case LOAD_INACTIVE_ITEMS:
      return Object.assign({}, state, { inactiveItems: action.payload });

    case GRAB_ITEM_IMAGES:
      return Object.assign({}, state, { images: [...action.payload] });

    case ADD_ITEM:
      return Object.assign({}, state, { newestItem: action.payload });

    case RESET_NEW_ITEM:
      return Object.assign({}, state, { newestItem: '' });

    case LOAD_CATEGORIES:
      return Object.assign({}, state, { categories: [...action.payload] });

    case LOAD_ITEMS_BY_CATEGORY:
      return Object.assign({}, state, { itemsByCategory: [...action.payload] });

    case ADD_CATEGORY:
      return Object.assign({}, state, { newCategory: [action.payload] });

    case ADD_SUBCATEGORY:
      return Object.assign({}, state, { newSubcategory: [action.payload] });

    case INCREMENT_ITEM_VIEWS:
      return Object.assign({}, state, { newestItem: '' });

    case GRAB_USER_THREADS:
      return Object.assign({}, state, { threads: [...action.payload] });

    case GRAB_THREAD_MESSAGES:
      return Object.assign({}, state, { messages: [...action.payload] });

    case POST_NEW_MESSAGE:
      return Object.assign({}, state, { messages: [...action.payload] });

    case GRAB_ALL_USERS:
      return Object.assign({}, state, { userList: [...action.payload] });

    case GRAB_USERNAME:
      return Object.assign({}, state, { username: action.payload });

    case UPDATE_CHOSEN_CATEGORY:
      return Object.assign({}, state, { chosen_category: action.payload });

    case UPDATE_CHOSEN_SUBCATEGORY:
      return Object.assign({}, state, { chosen_subcategory: action.payload });

    case GRAB_USER_CART:
      return Object.assign({}, state, { cart_items: [...action.payload] });

    case DELETE_ITEM_FROM_CART:
      return Object.assign({}, state, { cart_items: [...action.payload] });

    case ADMIN_ITEM_EDIT:
      return Object.assign({}, state, { item: action.payload });

    case GRAB_SHIPPING:
      return Object.assign({}, state, { shipping: [...action.payload] });

    case GRAB_SHIPPING_PRIMARY:
      return Object.assign({}, state, { shippingPrimary: [...action.payload] });

    case GRAB_PAYMENTS:
      return Object.assign({}, state, { payments: [...action.payload] });

    case UPDATE_PRIMARY_PAYMENT:
      return Object.assign({}, state, { payments: [action.payload] });

    case UPDATE_PRIMARY_ADDRESS:
      return Object.assign({}, state, { shipping: [action.payload] });

    case REMOVE_ADDRESS:
      return Object.assign({}, state, { removedAddress: action.payload });

    case GRAB_USER_SALES:
      return Object.assign({}, state, { sales: [...action.payload] });

    case GRAB_STATES:
      return Object.assign({}, state, { states: [action.payload] });

    case ADD_ADDRESS:
      return Object.assign({}, state, { shipping: [action.payload] });
    case GRAB_USER_ORDERS:
      return Object.assign({}, state, { orders: [...action.payload] });

    default:
      return state;
  }
}

function userReducer(state = userState, action) {
  switch (action.type) {
    case REGISTER:
      return Object.assign({}, state, { registrationSuccessful: true });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, { loggedIn: true, user: action.payload });

    case LOGIN_FAILURE:
      return Object.assign({}, state, { loggedIn: false, user: null });

    case LOGOUT_SUCCESS:
      return Object.assign({}, state, { loggedIn: false, user: null });

    case LOGOUT_FAILURE:
      return Object.assign({}, state);

    case UPDATE_USER_PASSWORD:
      return Object.assign({}, state, { passwordUpdateStatus: [action.payload] });

    case LOAD_SINGLE_USER:
      return Object.assign({}, state, { user: action.payload });

    case UPDATE_USER:
      return Object.assign({}, state, { updatedUser: action.payload });

    case DEACTIVATE_USER:
      return Object.assign({}, state, { updatedUser: action.payload });

    case ADMIN_USER_EDIT:
      return Object.assign({}, state, { updatedUser: action.payload });

    default:
      return state;
  }
}

const savannahApp = combineReducers({
  itemReducer,
  userReducer,
});

export default savannahApp;
