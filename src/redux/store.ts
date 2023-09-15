import { configureStore,combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import storage from 'redux-persist/lib/storage'
import { persistReducer,persistStore  } from 'redux-persist'
import thunk from 'redux-thunk';

const reducers = combineReducers({
  auth: authReducer,
})

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
 