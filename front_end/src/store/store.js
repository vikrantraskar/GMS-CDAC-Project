import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/es/storage/session';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

// get the Reducer for auth
import authReducer from '../slices/authSlice'
//common for all components
const rootReducer = combineReducers({ 
  auth: authReducer,
})
//persisteReducer configuration
const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth']
}
//data is persisted on page reload
const persistedReducer = persistReducer(persistConfig, rootReducer)

// create a store with required reducers
//configuring reducers
const store = configureStore({
  reducer: persistedReducer,
  // 
  devTools: process.env.NODE_ENV !== 'production',
  // 
  middleware: [thunk]
});
const persistor = persistStore(store);

export {store, persistor};
