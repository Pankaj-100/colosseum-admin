import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locations: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    fetchingLocations: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchedLocations: (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    },
    locationError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    locationDeleted: (state, action) => {
      state.locations = state.locations.filter(loc => loc._id !== action.payload);
    },
    locationAdded: (state, action) => {
      state.locations.push(action.payload);
    },
    locationUpdated: (state, action) => {
      const index = state.locations.findIndex(loc => loc._id === action.payload._id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    }
  },
});

export const {
  fetchingLocations,
  fetchedLocations,
  locationError,
  locationDeleted,
  locationAdded,
  locationUpdated,
} = locationSlice.actions;

export default locationSlice.reducer;
