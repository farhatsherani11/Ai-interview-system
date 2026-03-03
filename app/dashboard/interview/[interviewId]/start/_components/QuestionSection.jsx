// import { Lightbulb, Volume2 } from 'lucide-react';
// import React from 'react';

// function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
//   // ===== FIX 1: Ensure `mockInterviewQuestion` is always an array =====
//   const questions = React.useMemo(() => {
//   if (!mockInterviewQuestion) return [];

//   try {
//     const parsed = typeof mockInterviewQuestion === 'string'
//       ? JSON.parse(mockInterviewQuestion)
//       : mockInterviewQuestion;

//     // ✅ Safely extract the array
//     if (Array.isArray(parsed)) {
//       return parsed;
//     } else if (Array.isArray(parsed.interview_questions)) {
//       return parsed.interview_questions;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Failed to parse questions:", error);
//     return [];
//   }
// }, [mockInterviewQuestion]);


//   // ===== FIX 2: Early return if no questions =====
//   if (!questions.length) {
//     return (
//       <div className="p-5 border rounded-lg my-10 text-center text-gray-500">
//         No questions available.
//       </div>
//     );
//   }

//   // ===== FIX 3: Validate `activeQuestionIndex` =====
//   const safeActiveIndex = Math.max(
//     0, 
//     Math.min(activeQuestionIndex, questions.length - 1)
//   );

//   const textToSpeach = (text) => {
//     if ('speechSynthesis' in window) {
//       const speech = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(speech);
//     } else {
//       alert('Sorry, your browser does not support text to speech');
//     }
//   };

//   return (
//     <div className="p-5 border rounded-lg my-14">
//       {/* ===== FIX 4: Safe .map() with fallback ===== */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {questions.map((question, index) => (
//           <h2
//             key={`question-${index}`}
//             className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
//               safeActiveIndex === index
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-200'
//             }`}
//           >
//             Question #{index + 1}
//           </h2>
//         ))}
//       </div>

//       {/* ===== FIX 5: Safe question access ===== */}
//       <h2 className="my-5 text-md md:text-lg">
//         {questions[safeActiveIndex]?.question || "Question not found"}
//       </h2>

//       <Volume2
//         className="cursor-pointer"
//         onClick={() => textToSpeach(questions[safeActiveIndex]?.question || "")}
//       />

//       <div className="border rounded-lg p-5 bg-blue-100 mt-20">
//         <h2 className="flex gap-2 items-center text-primary">
//           <Lightbulb />
//           <strong>Note:</strong>
//         </h2>
//         <h2 className="text-sm text-primary my-2">
//           {process.env.NEXT_PUBLIC_QUESTION_NOTE}
//         </h2>
//       </div>
//     </div>
//   );
// }

// export default QuestionSection;



import { useState, useEffect } from "react"
  // Show loading state during hydration
import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  // Hook to detect if we're on the client side
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // ===== DEBUG: Only log on client side =====
  React.useEffect(() => {
    if (isClient) {
      console.log("=== DEBUG INFO ===");
      console.log("mockInterviewQuestion:", mockInterviewQuestion);
      console.log("Type:", typeof mockInterviewQuestion);
      console.log("Is Array:", Array.isArray(mockInterviewQuestion));
      if (mockInterviewQuestion && typeof mockInterviewQuestion === 'object') {
        console.log("Object keys:", Object.keys(mockInterviewQuestion));
      }
    }
  }, [mockInterviewQuestion, isClient]);

  // ===== EXTRACT QUESTIONS FROM ANY STRUCTURE =====
  const questions = React.useMemo(() => {
    if (!mockInterviewQuestion) {
      console.log("No mockInterviewQuestion provided");
      return [];
    }

    let result = [];

    try {
      // Case 1: It's already an array
      if (Array.isArray(mockInterviewQuestion)) {
        result = mockInterviewQuestion;
        console.log("Case 1: Direct array", result);
      }
      // Case 2: It's an object with various possible properties
      else if (typeof mockInterviewQuestion === 'object') {
        // Try different possible property names
        const possibleKeys = [
          'interview_questions',
          'questions',
          'interviewQuestions',
          'data',
          'items'
        ];
        
        for (const key of possibleKeys) {
          if (mockInterviewQuestion[key] && Array.isArray(mockInterviewQuestion[key])) {
            result = mockInterviewQuestion[key];
            console.log(`Case 2: Found array in property '${key}'`, result);
            break;
          }
        }
        
        // If no array found in known properties, check all properties
        if (result.length === 0) {
          const allValues = Object.values(mockInterviewQuestion);
          const arrayValue = allValues.find(value => Array.isArray(value));
          if (arrayValue) {
            result = arrayValue;
            console.log("Case 2b: Found array in object values", result);
          }
        }
      }
      // Case 3: It's a string that needs parsing
      else if (typeof mockInterviewQuestion === 'string') {
        const parsed = JSON.parse(mockInterviewQuestion);
        if (Array.isArray(parsed)) {
          result = parsed;
        } else if (parsed.interview_questions) {
          result = parsed.interview_questions;
        } else if (parsed.questions) {
          result = parsed.questions;
        }
        console.log("Case 3: Parsed from string", result);
      }

      // Validate that we have an array of objects with question property
      if (Array.isArray(result) && result.length > 0) {
        // Check if items have question property or similar
        const hasQuestions = result.every(item => 
          item && (item.question || item.text || item.content || item.prompt)
        );
        
        if (!hasQuestions) {
          console.warn("Array found but items don't have question-like properties:", result[0]);
        }
        
        console.log("Final questions array:", result);
        return result;
      }

    } catch (error) {
      console.error("Error processing questions:", error);
    }

    console.log("No valid questions found, returning empty array");
    return [];
  }, [mockInterviewQuestion]);

  // ===== DEBUG: Log processed questions =====
  React.useEffect(() => {
    if (isClient) {
      console.log("Processed questions:", questions);
      console.log("Questions length:", questions.length);
      if (questions.length > 0) {
        console.log("First question:", questions[0]);
      }
    }
  }, [questions, isClient]);

  // ===== EARLY RETURN WITH MORE INFO =====
  if (!questions || questions.length === 0) {
    console.log("Rendering 'No questions' - questions:", questions, "length:", questions?.length);
    return (
      <div className="p-5 border rounded-lg my-10 text-center">
        <div className="text-red-500 mb-2">No questions available.</div>
        <div className="text-xs text-gray-400">
          Debug: Questions length = {questions?.length || 0}
        </div>
        {mockInterviewQuestion && (
          <div className="text-xs text-gray-500 mt-2">
            Data received: {typeof mockInterviewQuestion} 
            {Array.isArray(mockInterviewQuestion) ? ' (array)' : ' (object)'}
          </div>
        )}
      </div>
    );
  }

  console.log("Rendering questions component - questions:", questions.length);

  // ===== VALIDATE ACTIVE INDEX =====
  const safeActiveIndex = Math.max(
    0, 
    Math.min(activeQuestionIndex, questions.length - 1)
  );

  // ===== GET QUESTION TEXT =====
  const getCurrentQuestion = () => {
    const currentQ = questions[safeActiveIndex];
    if (!currentQ) return "No question found";
    
    // Try different possible property names for the question text
    return currentQ.question || 
           currentQ.text || 
           currentQ.content || 
           currentQ.prompt || 
           currentQ.questionText ||
           JSON.stringify(currentQ);
  };

  const textToSpeach = (text) => {
    // Only run on client side
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else if (typeof window !== 'undefined') {
      alert('Sorry, your browser does not support text to speech');
    }
  };

  return (
    <div className="p-5 border rounded-lg my-14">
      {/* Question Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questions.map((question, index) => (
          <h2
            key={`question-${index}`}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
              safeActiveIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Current Question */}
      <h2 className="my-5 text-md md:text-lg">
        {getCurrentQuestion()}
      </h2>

      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeach(getCurrentQuestion())}
      />

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}

export default QuestionSection;