import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';


function ProtectedRoute({children}) {
    const navigate = useNavigate()
   const user = JSON.parse(localStorage.getItem('admin'))
   useEffect(()=>{
    if(!user){
         navigate('/')
    }
   },[user])
   
  return  children

    
  
}

export default ProtectedRoute