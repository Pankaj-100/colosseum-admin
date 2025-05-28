import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice'
import userReducer from './userSlice';
import languageReducer from './languageSlice';
import termsReducer from './termsConditionsSlice'
import videoReducer from './videoSlice';
import locationReducer from './locationSlice';
import codeReducer from './codeSlice'; 
const store = configureStore({
    reducer:{
        auth:authReducer,
        dashboard :dashboardReducer,
        user: userReducer,
        language: languageReducer,
        terms:termsReducer,
        video: videoReducer,
        location: locationReducer,
        code: codeReducer
    }
})

export default store