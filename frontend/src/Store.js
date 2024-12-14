import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './User/userSlice';


// Step 1: Define the persist configuration
const persistConfig = {
    key: 'root', // Key for localStorage
    storage, // Storage mechanism
    whitelist: ['user'], // Only persist the 'user' slice
};

// Step 2: Combine reducers
const rootReducer = combineReducers({
    user: userReducer, // Data you want to persist
});

// Step 3: Wrap the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Create the Redux store
const store = configureStore({
    reducer: persistedReducer,
});

export default store;



// Step 5: Create the persistor

export const persistor = persistStore(store);



