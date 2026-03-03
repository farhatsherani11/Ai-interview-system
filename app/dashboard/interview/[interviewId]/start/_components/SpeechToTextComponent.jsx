"use client"
import { useEffect } from 'react'
import useSpeechToText from 'react-hook-speech-to-text'

function SpeechToTextComponent({ onTranscript, onStop, shouldStart }) {
  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
    error,
  } = useSpeechToText({
    continous: true,
    useLegacyResults: false,
  })

  // Start/Stop only when prop `shouldStart` changes
  useEffect(() => {
    if (shouldStart) {
      try {
        startSpeechToText()
      } catch (err) {
        console.error('Failed to start recognition:', err)
      }
    } else {
      stopSpeechToText()
    }
  }, [shouldStart])

  // On transcript update
  useEffect(() => {
    if (results && results.length > 0) {
      onTranscript(results)
    }
  }, [results])

  // When recognition stops
  useEffect(() => {
    if (!isRecording && !shouldStart) {
      onStop()
    }
  }, [isRecording, shouldStart])

  return null
}
export default SpeechToTextComponent