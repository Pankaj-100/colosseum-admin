import { createSlice } from "@reduxjs/toolkit"; 
import english from '../language/english.json';
import spanish from '../language/spanish.json';


const initialState = {
    language : 'en',
     contentlang: english
}




 const languageSlice  = createSlice({
    name:'language',
   initialState,
   reducers:{
    changeLang: (state,action)=>{
      console.log(action,'action in rtk');
       
        if(action.payload == 'en'){
     state.language = 'sp';
     state.contentlang = spanish
        }else{
            state.language = 'en';
            state.contentlang = english
        }
    }
   }
 })

 export const {changeLang} = languageSlice.actions;
 export default languageSlice.reducer;