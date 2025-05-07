import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codes: [],
  count: 0,
  loading: false,
  error: false,
  errorMessage: '',
  search: '',
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    fetchingCodes: (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = '';
    },
    fetchedCodes: (state, action) => {
      state.codes = action.payload?.codes;
      state.count = action.payload?.count;
      state.loading = false;
    },
    codeError: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload?.message || 'Unknown error';
    },
    searchCodes: (state, action) => {
      state.search = action.payload?.search || '';
    },
    codeRevoked: (state, action) => {
      // Matching by decryptedCode
      state.codes = state.codes.filter(code => code.decryptedCode !== action.payload);
      state.count = state.count - 1;
    }
  },
});

export const {
  fetchingCodes,
  fetchedCodes,
  codeError,
  searchCodes,
  codeRevoked,
} = codeSlice.actions;

export default codeSlice.reducer;
