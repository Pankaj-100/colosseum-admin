import React from 'react'
import { ClipLoader } from 'react-spinners'
function Spinner({size,color='black'}) {
  return (
    <div><ClipLoader size={size} color={color} /></div>
  )
}

export default Spinner