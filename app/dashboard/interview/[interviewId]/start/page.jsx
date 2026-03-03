// "use client"
// import React, { useEffect, useState, use } from 'react';
// import { MockInterview } from '@/utils/schema';
// import { db } from "@/utils/db"
// import { eq } from "drizzle-orm";
// import { Button } from "@/components/ui/button"
// import Link  from 'next/link'
// import QuestionSection from './_components/QuestionSection'; 
// import RecordAnswerSection from './_components/RecordAnswerSection';
// function StartInterview({ params }) {
//   // Properly unwrap the params promise
//   const unwrappedParams = use(params);
//   const interviewId = unwrappedParams.interviewId;

//   const [interviewData, setInterviewData] = useState();
//   const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
//   const [loading, setLoading] = useState(true);
//   const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
//   useEffect(() => {
//     if (interviewId) {
//       GetInterviewDetails();
//     }
//   }, [interviewId]);

//   const GetInterviewDetails = async() => {
//     try {
//       const result = await db.select()
//         .from(MockInterview)
//         .where(eq(MockInterview.mockId, interviewId));
      
//       if (result.length > 0) {
//         const jsonMockResp = JSON.parse(result[0].jsonMockResp);
//         console.log(jsonMockResp)
//         setMockInterviewQuestion(jsonMockResp);
//         setInterviewData(result[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching interview data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!interviewData) {
//     return <div>Interview not found</div>;
//   }

//   return (
//     <div>
//         <div className='grid grid-flow-col md:grid-cols-2 gap-10'>
//          {/* Question */}
//          <QuestionSection 
//          mockInterviewQuestion={mockInterviewQuestion}
//          activeQuestionIndex={activeQuestionIndex}/>
//          {/* video/audio recording */}
//          <RecordAnswerSection
//           mockInterviewQuestion={mockInterviewQuestion}
//           activeQuestionIndex={activeQuestionIndex}
//           interviewData={interviewData}
//          />
//         </div>
//          <div className='flex justify-end gap-6'>
//              { activeQuestionIndex>0 && 
//              <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} className="bg-sky-400 hover:bg-gray-100 text-black">Previous Question</Button>}
//              { activeQuestionIndex!=mockInterviewQuestion?.length-1 &&
//              <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}className="bg-sky-400 hover:bg-gray-100 text-black">Next Question</Button>}
//              { activeQuestionIndex==mockInterviewQuestion?.length-1 &&
//              <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
//              <Button className="bg-sky-400 hover:bg-gray-100 text-black">End Interview</Button></Link>}
//       </div>
//     </div>
//   )
// }
// export default StartInterview




"use client"
import React, { useEffect, useState, use } from 'react';
import { MockInterview } from '@/utils/schema';
import { db } from "@/utils/db"
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button"
import Link  from 'next/link'
import QuestionSection from './_components/QuestionSection'; 
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview({ params }) {
  // Properly unwrap the params promise
  const unwrappedParams = use(params);
  const interviewId = unwrappedParams.interviewId;

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);

  // Calculate questions length for navigation
  const questionsLength = React.useMemo(() => {
    if (!mockInterviewQuestion) return 0;
    
    if (Array.isArray(mockInterviewQuestion)) {
      return mockInterviewQuestion.length;
    } else if (mockInterviewQuestion.interviewQuestions && Array.isArray(mockInterviewQuestion.interviewQuestions)) {
      return mockInterviewQuestion.interviewQuestions.length;
    } else if (mockInterviewQuestion.interview_questions && Array.isArray(mockInterviewQuestion.interview_questions)) {
      return mockInterviewQuestion.interview_questions.length;
    } else if (mockInterviewQuestion.questions && Array.isArray(mockInterviewQuestion.questions)) {
      return mockInterviewQuestion.questions.length;
    }
    
    return 0;
  }, [mockInterviewQuestion]);

  // Debug log to check the length
  React.useEffect(() => {
    console.log("questionsLength:", questionsLength);
    console.log("activeQuestionIndex:", activeQuestionIndex);
    console.log("mockInterviewQuestion:", mockInterviewQuestion);
  }, [questionsLength, activeQuestionIndex, mockInterviewQuestion]);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async() => {
    try {
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      
      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp)
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
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
    <div>
        <div className='grid grid-flow-col md:grid-cols-2 gap-10'>
         {/* Question */}
         <QuestionSection 
         mockInterviewQuestion={mockInterviewQuestion}
         activeQuestionIndex={activeQuestionIndex}/>
         {/* video/audio recording */}
         <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
         />
        </div>
         <div className='flex justify-end gap-6'>
             { activeQuestionIndex>0 && 
             <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} className="bg-sky-400 hover:bg-gray-100 text-black">Previous Question</Button>}
             { activeQuestionIndex != questionsLength-1 &&
             <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}className="bg-sky-400 hover:bg-gray-100 text-black">Next Question</Button>}
             { activeQuestionIndex == questionsLength-1 &&
             <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
             <Button className="bg-sky-400 hover:bg-gray-100 text-black">End Interview</Button></Link>}
      </div>
    </div>
  )
}
export default StartInterview