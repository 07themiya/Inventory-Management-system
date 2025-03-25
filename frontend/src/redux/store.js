import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './reducers';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer
  }
});