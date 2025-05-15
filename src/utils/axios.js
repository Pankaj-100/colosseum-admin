// import axios from "axios";
// import { useSelector } from "react-redux";
//  const {token} = useSelector(state=>state.auth)
// const axiosInstance = axios.create({
    // baseURL: 'https://yeii-api.onrender.com', 
//     baseURL: 'http://localhost:4000', 
     
//   });
//   axiosInstance.defaults.headers.common['Authorization'] = token;
//   export default axiosInstance

import axios from "axios";
import store from "../store/store"; // Import your Redux store directly

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
      config.headers['Authorization'] = token1; 
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
