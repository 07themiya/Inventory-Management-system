import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, ADD_PURCHASE, ADD_USAGE } from './actions';

const initialState = {
  items: [
    { id: 1, name: 'Flour', category: 'Baking', initialStock: 100, purchased: 50, used: 30 },
    { id: 2, name: 'Sugar', category: 'Baking', initialStock: 50, purchased: 20, used: 15 },
    { id: 3, name: 'Eggs', category: 'Dairy', initialStock: 30, purchased: 60, used: 40 }
  ],
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