// "use client"
// import React, { useEffect, useState,use} from 'react'; 
// import { db } from "@/utils/db"
// import { MockInterview } from '../../../../utils/schema';
// import { Button } from "@/components/ui/button";
// import { eq } from "drizzle-orm";
// import { Webcam as WebcamIcon } from 'lucide-react'; 
// import Webcam from 'react-webcam';

// function interview({params}) {
//    const [interviewData,setInterviewData]=useState()
//    const [webCamEnable,setwebCamenable]=useState(false)
//    const unwrappedParams = use(params);
//     useEffect(()=>{
//        console.log(unwrappedParams.interviewId)
//        GetInterviewDetails()
//     },[])
//     /** use to get mockidor interview id */
//     const GetInterviewDetails=async()=>{
//         const result=await db.select().from(MockInterview).where(eq(MockInterview.mockId,unwrappedParams.interviewId))
//         console.log(result)
//         setInterviewData(result[0])
//     }
  

//   return (
//     <div className='my-10 flex justify-center flex-col items-center'>
//       <h2 className='font-bold text-2xl'>
//         Let's get started !
//       </h2>
//       <div>
//         {webCamEnable?<Webcam 
//         onUserMedia={()=>setwebCamenable(true)}
//         onUserMediaError={()=>setwebCamenable(false)}
//         mirrored={true}
//         style={{
//            height:300,
//            width:300
//         }}/>
//         :
//         <>
//         <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
//         <Button onClick={()=>setwebCamenable(true)}>Enable WebCam and Microphone</Button>
//         </>}
//       </div>
//       <div className='flex flex-col my-5 gap-5'>
//         <h2 className='text-lg'><strong>job position/job role:</strong>{interviewData.jobPosition} </h2>
//         <h2 className='text-lg'><strong>job Describtion:</strong>{interviewData.jobDesc} </h2>
//         <h2 className='text-lg'><strong>job Experience:</strong>{interviewData.jobExperiance} </h2>
//       </div>
//     </div>
//   )
// }

// export default interview






"use client"
import React, { useEffect, useState, use } from 'react';
import { MockInterview } from '../../../../utils/schema';
import { db } from "@/utils/db"
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Lightbulb, Webcam as WebcamIcon } from 'lucide-react'; 
import Webcam from 'react-webcam';
import Link from 'next/link';

export default function InterviewPage({ params }) {
  // Unwrap the params promise
  const unwrappedParams = use(params);
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnable, setwebCamenable] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log(unwrappedParams.interviewId);
    GetInterviewDetails();
  }, [unwrappedParams.interviewId]);

  const GetInterviewDetails = async() => {
    try {
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, unwrappedParams.interviewId));
      
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!interviewData) {
    return <div>Interview not found</div>;
  }

  return (
    <div className='my-10 flex justify-center flex-col items-center'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
          <div className='flex flex-col my-5 gap-5 '>
             <div className='flex flex-col p-5 gap-5 rounded-lg border'>
                <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData.jobPosition}</h2>
                <h2 className='text-lg'><strong>job Describtion:</strong>{interviewData.jobDesc} </h2>
                <h2 className='text-lg'><strong>job Experience:</strong>{interviewData.jobExperiance} </h2>
              </div>
              <div className='p-5 border rounded-lg border-x-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
              </div>
            </div>
        <div>
            {webCamEnable ? (
              <Webcam 
                onUserMedia={() => setwebCamenable(true)}
                onUserMediaError={() => setwebCamenable(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300
                }}
              />
            ) : (
              <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
                <Button variant="ghost"className="w-full"onClick={() => setwebCamenable(true)}>Enable WebCam and Microphone</Button>
              </>
            )}
          </div>
          <div className='flex justify-end items-end'>
             <Link href={'/dashboard/interview/'+unwrappedParams.interviewId+'/start'}>
             <Button>Start Interview</Button>
            </Link>
         
          </div>
         
      </div>
      
    </div>
  )
}