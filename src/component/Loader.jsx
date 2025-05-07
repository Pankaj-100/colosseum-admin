import React from 'react'
import { Triangle } from 'react-loader-spinner'
function Loader() {
  return (
    <div className='flex  justify-center items-center'><Triangle
    visible={true}
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="triangle-loading"
    wrapperStyle={{}}
    wrapperClass=""
    /></div>
  )
}

export default Loader