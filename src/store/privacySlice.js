import { createSlice } from "@reduxjs/toolkit";
import reducer from "./languageSlice";

const initialState = {
    content:'',
    loading:false,
    error:false,
    errorMessage:''
}
const privacySlice = createSlice({
 initialState,
 name:'privacy',
 reducers:{
    fetchingPrivacy:(state,action)=>{
        state.loading = true
    },
    fetchedPrivacy:(state,action)=>{
        state.loading = false,

        state.content = action.payload?.content?.content
    },
    privacyError:(state,action)=>{
        state.error = true,
        state.loading = false,
        state.errorMessage = action.payload?.message
    }
 }
})

export const {fetchingPrivacy,fetchedPrivacy,privacyError} = privacySlice.actions;

export default  privacySlice.reducer