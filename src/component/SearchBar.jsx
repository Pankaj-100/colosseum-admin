import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getUsers } from '../store/api'
import { searchUser } from '../store/userSlice'

function SearchBar({ placeholder, type }) {
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const value = e.target.value
    setSearch(value)

    if (type === 'user') {
      dispatch(searchUser(value))              // Update search state in Redux
      getUsers(dispatch, value)                // Immediately search from API
    }
  }

  return (
    <div className='flex justify-end'>
      <input
        type='search'
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
        className='px-1 text-sm rounded py-1 appearance-none'
      />
    </div>
  )
}

export default SearchBar
