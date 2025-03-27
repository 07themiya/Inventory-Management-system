import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, ADD_PURCHASE, ADD_USAGE } from './actions';

const initialState = {
  items: [],
  purchases: [],
  usage: []
};

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case ADD_PURCHASE:
      return {
        ...state,
        purchases: [...state.purchases, action.payload]
      };
    case ADD_USAGE:
      return {
        ...state,
        usage: [...state.usage, action.payload]
      };
    default:
      return state;
  }
}