"use client"
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
function Dashboard() {
    return (
        <div className='p-10'>
            <h2 className='font-bold text-2xl'>Dashboard</h2>
            <h2 className='text-gray-500'>create and start your AI mockup interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
                 <AddNewInterview/>
            </div>

            {/* Previous Interview List */}
            <InterviewList/> 
        </div>
       
    )
}

export default Dashboard
import Link from "next/link";

<Link
  href="/dashboard/ats-system"
  className="bg-green-500 text-white px-4 py-2 rounded"
>
  Resume ATS System
</Link>