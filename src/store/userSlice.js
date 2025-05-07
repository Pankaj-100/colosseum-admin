import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
    error:false,
    errorMessage:'',
    users:[],
    loading:false,
    count:0,
    user:{},
    search:'',
   
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        fetchingUser : (state,action)=>{
            state.loading = true
            
        },
        userFetched: (state,action)=>{
            state.users = action.payload?.users,
            state.count = action.payload?.count,
           
            state.loading = false 
        },
        userError : (state,action)=>{
       state.error = true
      state.errorMessage = action.payload.message
        },
        fetchUserById:(state,action)=>{
            state.user = action.payload?.user,
            state.loading = false
        },
        searchUser:(state,action)=>{
            state.search = action.payload?.search
             }
    }
})

export const {userError,userFetched,fetchingUser,fetchUserById,searchUser} = userSlice.actions
export default userSlice.reducer