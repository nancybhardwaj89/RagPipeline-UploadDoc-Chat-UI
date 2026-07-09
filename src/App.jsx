import { useState } from 'react'
import UploadView from './UploadView'
import ChatView from './ChatView'

export default function App() {
  const [step, setStep] = useState('upload') // 'upload' | 'chat'

  if (step === 'upload') {
    return <UploadView onContinue={() => setStep('chat')} />
  }

  return <ChatView onStartOver={() => setStep('upload')} />
}
