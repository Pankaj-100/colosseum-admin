import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import DashCard from '../component/card/DashCard'
import { CgProfile } from "react-icons/cg";
import { CgCamera } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard } from '../store/api';

function Dashboard() {
  const dispatch = useDispatch()
  const { totalUsers, loading,totalVideos } = useSelector(state => state.dashboard)  // Get totalUsers directly
  const { contentlang } = useSelector(state => state.language)

  useEffect(() => {
    getDashboard(dispatch)
  }, [dispatch])

  return (
    <Layout>
      <div className='flex flex-wrap justify-center gap-2 md:justify-start lg:justify-start'>
        <DashCard 
          type={'users'} 
          count={totalUsers}  // Pass the count directly
          icon={<CgProfile size={30} />} 
          title={'users'}
          loading={loading}
        />
           <DashCard 
          type={'videos'} 
          count={totalVideos}  // Pass the count directly
          icon={<CgCamera size={30} />} 
          title={'videos'}
          loading={loading}
        />
       
      
      </div>
    
    </Layout>
  )
}

export default Dashboard