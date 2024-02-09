import { useState, ChangeEvent, FormEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnBoarding(false)
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target

    if (!value) setShouldShowOnBoarding(true)

    setContent(value)
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault()

    if (content !== '') {
      onNoteCreated(content)
      setContent('')
      setShouldShowOnBoarding(true)

      toast.success('Note created successfully!')
    }
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Unfortunately, your browser does not support recording.')
      return true
    }

    setIsRecording(true)
    setShouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'en'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (e) => {
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (e) => {
      console.error(e)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    if (speechRecognition !== null) speechRecognition.stop()

    setIsRecording(false)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col text-left rounded-md bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Add note</span>
        <p className="text-sm leading-6 text-slate-400 ">
          Record an audio note that will be automatically converted to text.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        <Dialog.Content className="overflow-hidden inset-0 md:inset-auto fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" onClick={() => setShouldShowOnBoarding(true)} />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Add note
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400 ">
                  Start by <button type="button" className="font-medium text-lime-400 hover:underline" onClick={handleStartRecording}>recording an audio note</button> or, if you prefer, <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">use text only</button>.
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )
              }
            </div>
            {isRecording ? (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Recording! (click to stop)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handleSaveNote}
              >
                Salve note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}