import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem('token') || null,
  admin: JSON.parse(localStorage.getItem('admin')) || null,
  error: false,
  loading: false,
  errorMessage: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.loading = false;
      state.error = false;
    },
    setUser: (state, action) => {
      state.admin = action.payload.admin;
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
      state.loading = false;
      state.error = false;
    },
    startLogin: (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = '';
    },
    loginError: (state, action) => {
      state.error = true;
      state.errorMessage = action.payload?.message || 'Login failed';
      state.loading = false;
    },
    logOut: (state) => {
      state.admin = null;
      state.token = null;
      state.error = false;
      state.errorMessage = '';
      localStorage.removeItem('admin');
      localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      state.admin = action.payload.admin;
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
    }
  }
});

export const {
  setToken,
  setUser,
  logOut,
  startLogin,
  loginError,
  updateProfile
} = authSlice.actions;

export default authSlice.reducer;
