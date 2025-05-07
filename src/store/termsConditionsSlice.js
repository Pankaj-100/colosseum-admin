import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    content:'',
    error:false,
    loading:false,
    errorMessage:''

}
const termsSlice = createSlice({
    initialState,
    name:'terms',
    reducers:{
        fetchingTerms:(state,action)=>{
            state.loading = true
        },
        fetchedTerms:(state,action)=>{
            state.loading = false,
            state.content =  action.payload?.content?.content
        },
        termsError:(state,action)=>{
            state.error = true,
            state.errorMessage = action.payload?.message
        }
    }
})

export const {fetchedTerms,fetchingTerms,termsError} = termsSlice.actions;
export default   termsSlice.reducer