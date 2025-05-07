import { Input } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {  getUsers } from '../store/api'
import { searchUser } from '../store/userSlice'

function SearchBar({placeholder,options,type}) {
     const [search,setSearch] = useState('')
     const dispatch = useDispatch()
       if(search != '' && type == 'user') { dispatch(searchUser(search))}
     function handleSubmit(e){
       e.preventDefault()
     
        if (type == 'user'){
        console.log(search,'search');
        getUsers(dispatch,search)
       }
     }
  return (
    <div className='flex justify-end  '>
 <datalist id="list" >
    <option value="1" />
    <option value="12"/>
    <option value="3"/>
    <option value="4"/>
    <option value="5"/>
  </datalist>
   <form onSubmit={handleSubmit}>
   <input title={placeholder} type="search" onChange={(e)=>setSearch(e.target.value)} className=' px-1 text-sm rounded py-1 appearance-none '   placeholder={placeholder} list='list' />


   </form>
    </div>
  )
}

export default SearchBar