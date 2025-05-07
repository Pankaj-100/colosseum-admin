import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: false,
    loading: false,
    errorMessage: '',
    totalUsers: 0 ,
    totalVideos: 0   
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        fetchingDashboard: (state) => {
            state.loading = true
        },
        fetchedDashboard: (state, action) => {
            state.loading = false,
            state.totalUsers = action.payload?.data?.totalUsers,
            state.totalVideos = action.payload?.data?.totalVideos    
        },
        errorDashboard: (state, action) => {
            state.error = true,
            state.loading = false,
            state.errorMessage = action.payload.message
        }
    }
})

export const {fetchedDashboard,fetchingDashboard,errorDashboard} = dashboardSlice.actions;
export default  dashboardSlice.reducer 