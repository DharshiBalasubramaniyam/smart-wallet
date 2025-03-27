import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth';

// Create and configure the Redux store
const store = configureStore({
    reducer: {
        // Define the reducer for the 'auth' slice
        auth: authReducer,
    }
});

// Export the configured store as the default export
export default store;
