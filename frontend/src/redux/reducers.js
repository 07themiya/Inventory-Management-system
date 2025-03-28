import { 
  ADD_ITEM, 
  UPDATE_ITEM, 
  DELETE_ITEM, 
  FETCH_ITEMS,
  FETCH_PURCHASE_LOGS, 
  HANDLE_API_ERROR,
  ADD_PURCHASE_LOG 
} from './actions';

export const UPDATE_PURCHASE = 'UPDATE_PURCHASE';
export const REMOVE_PURCHASE = 'REMOVE_PURCHASE';

// Initial states
const initialInventoryState = {
  items: []
};

const initialState = {

  inventory: {
    items: [],
    loading: false,
    error: null,
    purchaseLogs: [],
  },
  usage: {
    usageData: [],
    records: [], 
    loading: false,
    error: null
  }
};

const initialPurchaseState = {
  purchaseLogs: []  // Keep the key consistent
};

const usageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USAGE_SUCCESS':
      return {
        ...state,
        usageData: action.payload,
        loading: false,
      };
    case 'FETCH_USAGE_FAILURE':
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};

// Inventory reducer
export function inventoryReducer(state = initialInventoryState, action) {
  switch (action.type) {
    case FETCH_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload.id 
            ? { ...item, ...action.payload.updates } 
            : item
        )
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
}

// Purchase reducer
export function purchaseLogReducer(state = initialPurchaseState, action) {
  switch (action.type) {

    case FETCH_PURCHASE_LOGS:
      return {
        ...state,
        purchaseLogs: action.payload, // Correct key is purchaseLogs
        error: null,
      };

    case ADD_PURCHASE_LOG:
      return {
        ...state,
        purchaseLogs: [action.payload, ...state.purchaseLogs] // Use purchaseLogs, not purchases
      };

    case UPDATE_PURCHASE:
      return {
        ...state,
        purchaseLogs: state.purchaseLogs.map(purchase => 
          purchase.id === action.payload.tempId ? action.payload.purchase : purchase
        )
      };

    case REMOVE_PURCHASE:
      return {
        ...state,
        purchaseLogs: state.purchaseLogs.filter(purchase => purchase.id !== action.payload)
      };

    case HANDLE_API_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    // ... your existing cases
    
    // Add these new cases for usage
    case 'FETCH_USAGE_REQUEST':
      return {
        ...state,
        usage: {
          ...state.usage,
          loading: true,
          error: null
        }
      };
    case 'FETCH_USAGE_SUCCESS':
      return {
        ...state,
        usage: {
          ...state.usage,
          loading: false,
          records: action.payload
        }
      };
    case 'FETCH_USAGE_FAILURE':
      return {
        ...state,
        usage: {
          ...state.usage,
          loading: false,
          error: action.error
        }
      };
    default:
      return state;
  }
}