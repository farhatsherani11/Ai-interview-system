// "use client"
// import { Mic } from 'lucide-react'
// import { useEffect, useState, useRef } from 'react'
// import Image from 'next/image'
// import { Button } from "@/components/ui/button"
// import dynamic from 'next/dynamic'
// import { toast } from 'sonner'
// import { chatSession } from "@/utils/GeminAiModel";
// import { UserAnswer } from '../../../../../../utils/schema'
// import moment from 'moment'
// import { useUser } from '@clerk/nextjs';
// import useSpeechToText from 'react-hook-speech-to-text';
// // Dynamically import Webcam with SSR disabled
// const Webcam = dynamic(
//   () => import('react-webcam'),
//   { 
//     ssr: false,
//     loading: () => <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center">Loading camera...</div>
//   }
// )


// function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex,interviewData}) {
//   const [userAnswer, setUserAnswer] = useState('')
//   const [showWebcam, setShowWebcam] = useState(true)
//   const {user}=useUser();
//   const [loading,setLoading]=useState(false)


//   const {
//     error,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continous:true,
//     useLegacyResults:false})

  
//   useEffect(() => {
//      results.map((result)=>{
//       setUserAnswer(prevAns=>prevAns+result?.transcript)
//      })
//   }, [results])



// useEffect(()=>{
//   if(!isRecording&&userAnswer.length>10){
//     UpdateUserAnswer()
//   }
// },[userAnswer])

//   const toggleWebcam = () => {
//     setShowWebcam(!showWebcam)
//   }

//   const StartStopRecording = async () => {
//     if (isRecording) { 
     
//       stopSpeechToText()

    
      
//     } else {
//       startSpeechToText()
     
//     }
//   }

//   if (!isClient) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[300px] w-full bg-gray-200">
//         <p>Loading components...</p>
//       </div>
//     )
//   }

//   if (!speechApiAvailable) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[300px] w-full bg-gray-200">
//         <p>Speech recognition is not supported in your browser</p>
//       </div>
//     )
//   }
  

//   const UpdateUserAnswer=async()=>{
//     console.log(userAnswer)
//      setLoading(true)
//      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
//         User answer: ${userAnswer}, Depands on question and user answer for give interview question
//         Please provide: 
//         1. Rating (1-5)
//         2. Feedback (3-5 lines) as area of improvment if any
//         in JSON format with 'rating' and 'feedback' fields`

     
//         const result = await chatSession.sendMessage(feedbackPrompt)
//         const mockJsonResp = result.response.text().replace(/```json|```/g, '')
//         console.log(mockJsonResp)
//         const jsonFeedbackResp=JSON.parse(mockJsonResp)
//         toast.success('Feedback received!')
//         const resp=await db.insert(UserAnswer).values({
//           mockIdRef:interviewData?.mockId,
//           question:mockInterviewQuestion[activeQuestionIndex]?.question,
//           correctAnswer:mockInterviewQuestion[activeQuestionIndex]?.answer,
//           userAns:userAnswer,
//           feedback:jsonFeedbackResp?.feedback,
//           rating:jsonFeedbackResp?.rating,
//           userEmail:user?.primaryEmailAddress?.emailAddress,
//           createAt:moment().format('DD-MM-YYYY')

//         })
//         if(resp){
//           toast('user Answer recorded successfully')
//         }
//        setUserAnswer('')
//         setLoading(false);
      
//   }

  

//   return (
//     <div className="space-y-4 my-10">
//       <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
//         {showWebcam ? (
//           <Webcam 
//             className="w-full h-full object-cover"
//             mirrored={true}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//             <Image 
//               src="/webcam.jpg" 
//               alt="Webcam placeholder" 
//               width={200}
//               height={200}
//               className="object-contain max-w-full max-h-full"
//               onError={(e) => {
//                 console.error("Image failed to load")
//                 e.target.src = "/fallback-image.png"
//               }}
//             />
//           </div>
//         )}
//       </div>

//       <div className="flex gap-4 justify-center">
//         <Button 
//           variant="outline" 
//           className="px-6 py-3 border rounded-md bg-sky-400 flex items-center gap-2"
//           onClick={toggleWebcam}
//         >
//           {showWebcam ? "Hide Camera" : "Show Camera"}
//         </Button>
        
//         <Button 
         
//           variant="outline" 
//           className="px-6 py-3 border rounded-md bg-sky-400 flex items-center gap-2"
//           onClick={StartStopRecording}
//         >
//           {isRecording ? (
//             <span className='text-red-600 flex gap-2'>
//               <Mic /> Stop & Save
//             </span>
//           ) : (
//             <span className="flex gap-2">
//               <Mic /> Record Answer
//             </span>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default RecordAnswerSection





"use client"
import { Mic } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { chatSession } from "@/utils/GeminAiModel"
import { UserAnswer } from '../../../../../../utils/schema'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../../../utils/db' 
import { parse } from 'node:path'
 
// Dynamic imports
const Webcam = dynamic(() => import('react-webcam'), { ssr: false })
const SpeechToTextWrapper = dynamic(() => import('./SpeechToTextComponent'), { ssr: false })

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('')
  const [showWebcam, setShowWebcam] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [jsonresp,setjsonresponse]=useState([])
  // const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const { user } = useUser()

  const toggleWebcam = () => setShowWebcam(!showWebcam)

  const StartStopRecording = () => {
    if (isRecording) {
      // Stop speech recognition
      setIsRecording(false)
    } else {
      // Clear previous answer and start
      setUserAnswer('')
      setIsRecording(true)
     
    }
    
  }

  const handleTranscript = (results) => {
    results.forEach(result => {
      setUserAnswer(prev => prev + result.transcript)
    })
  }

  const handleStop = () => {
  if (userAnswer.length > 10) {
    const snapshot = {
      question: mockInterviewQuestion.interview_questions[activeQuestionIndex]
.question,
      correctAns: mockInterviewQuestion.interview_questions[activeQuestionIndex]
.answer,
    }

    if (!snapshot.question) {
      toast.error("No valid question found. Please try again.")
      return
    }

    UpdateUserAnswer(snapshot)
  }
}



  const UpdateUserAnswer = async ({ question, correctAns }) => {
    try {
      setLoading(true)
      

      const prompt = "Question:"+mockInterviewQuestion.interview_questions[activeQuestionIndex]
.question+
           "User answer:"+ userAnswer +"Depands on question and user answer for give interview question"+
           "Please provide: 1. Rating (1-5) 2. Feedback (3-5 lines) as area of improvment if any in JSON format with 'rating' and 'feedback' fields "
      const result = await chatSession.sendMessage(prompt)
       const mockJsonResp = (await result.response.text()).replace('```json','').replace('```','')
       console.log(mockJsonResp)
        const JesonFeedbackResp = JSON.parse(mockJsonResp) 
        const resp=await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question,
        correctAns,
        userAns: userAnswer,
        feedback:JesonFeedbackResp?.feedback,
        rating: JesonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createAt: moment().format('DD-MM-YYYY'),
      })
      if(resp){
        toast('user answer record success')
      }
      
    
     
      
      toast.success('Feedback received & saved!')
      setUserAnswer('')
    } catch (err) {
      toast.error('Error saving answer')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-11 my-14">
      <SpeechToTextWrapper
        shouldStart={isRecording}
        onTranscript={handleTranscript}
        onStop={handleStop}
      />

      <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
        {showWebcam ? (
          <Webcam className="w-full h-full object-cover" mirrored={true} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Image
              src="/webcam.jpg"
              alt="Webcam placeholder"
              width={200}
              height={200}
              className="object-contain max-w-full max-h-full"
              onError={(e) => {
                console.error("Image failed to load")
                e.target.src = "/fallback-image.png"
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          className="px-6 py-3 border rounded-md bg-sky-400 flex items-center gap-2"
          onClick={toggleWebcam}
        >
          {showWebcam ? "Hide Camera" : "Show Camera"}
        </Button>

        <Button
          variant="outline"
          className="px-6 py-3 border rounded-md bg-sky-400 flex items-center gap-2"
          onClick={StartStopRecording}
          disabled={loading}
        >
          {isRecording ? (
            <span className='text-red-600 flex gap-2'>
              <Mic /> Stop & Save
            </span>
          ) : (
            <span className="flex gap-2">
              <Mic /> Record Answer
            </span>
          )}
        </Button>
      </div>
     
    </div>
  )
}

export default RecordAnswerSection
