

import axios from "axios";
import store from "../store/store"; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', 
    // baseURL: 'https://colosseum-backend.onrender.com', 
});

// Add a request interceptor to dynamically add the token
axiosInstance.interceptors.request.use(
  (config) => {
    // Access the token from the Redux store
    const { token } = store.getState().auth;
    
    if (token) {
      const token1 = JSON.parse(token)
      console.log(token)
      config.headers['Authorization'] = token1; 
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
