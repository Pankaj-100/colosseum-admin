import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  terms: [],             // list of all terms
  singleTerm: null,      // for view/edit specific term
  loading: false,
  error: false,
  errorMessage: '',
};


const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {
    fetchingTerms: (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = '';
    },
    fetchedTerms: (state, action) => {
      state.loading = false;
      state.terms = action.payload;
    },
    fetchedTermByLanguage: (state, action) => {
      state.loading = false;
      state.singleTerm = action.payload;
    },
termSaved: (state, action) => {
  state.loading = false;
  const updatedTerm = action.payload;
  const index = state.terms.findIndex(t => t._id === updatedTerm._id);
  if (index !== -1) {
    state.terms[index] = updatedTerm;
  } else {
    // Add new term to the beginning of the array
    state.terms = [updatedTerm, ...state.terms];
  }
},
    termDeleted: (state, action) => {
      state.loading = false;
      state.terms = state.terms.filter(t => t._id !== action.payload);
    },
    termsError: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload?.message || 'Something went wrong';
    },
    fetchedTermById: (state, action) => {
  state.loading = false;
  state.singleTerm = action.payload;
}
  },
});

export const {
  fetchingTerms,
  fetchedTerms,
  fetchedTermByLanguage,
  termSaved,
  termDeleted,
  fetchedTermById,
  termsError
} = termsSlice.actions;

export default termsSlice.reducer;
