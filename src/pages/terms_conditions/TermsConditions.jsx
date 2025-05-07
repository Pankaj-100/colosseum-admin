import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { FaEdit } from "react-icons/fa";
import EditTermsCondition from './EditTermsCondition';
import { useDispatch, useSelector } from 'react-redux';
import { getTerms } from '../../store/api';
import Skeleton from "react-loading-skeleton";

function TermsConditions() {
    const [showModal,setShowModel] = useState(false)
    const {content,loading} = useSelector(state=>state.terms)
   const dispatch = useDispatch()
 useEffect(()=>{
   getTerms(dispatch)
  
 },[])
    const onhide = ()=>{
      setShowModel(false)
      getTerms(dispatch)
    }
  return (
<Layout>
  {
    loading ? <>
    <Skeleton height={30} width={300}/>

    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    </> : <>
    {
    !showModal && <> <div className='flex justify-between items-center'>
    <h1 className='text-xl font-bold text-gray-600'>Terms & Conditions</h1>
    <span onClick={()=>setShowModel(true)} className='cursor-pointer'><FaEdit />
    </span>
 </div>
 <div dangerouslySetInnerHTML={{__html:content}}></div>
 </>
 }
    </>
  }
 
 <div>
 { showModal && <EditTermsCondition onHide={onhide} />}
    
 </div>

</Layout>
    
      )
}

export default TermsConditions