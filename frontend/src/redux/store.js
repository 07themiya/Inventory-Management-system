import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { inventoryReducer } from './reducers';
import { purchaseLogReducer } from './reducers';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,  // Handle inventory state
    purchaseLogs: purchaseLogReducer,  // Handle purchase logs state
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(thunk),  // Add thunk middleware
  devTools: process.env.NODE_ENV !== 'production',  // Enable devTools only in development
});

export default store;
