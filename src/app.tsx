import { useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { Linkedin } from 'lucide-react'
import * as Lucide from 'lucide-react'
import { NoteCard } from './components/note-card'
import { NewNoteCard } from './components/new-note-card'

interface Note {
  id: string,
  date: Date,
  content: string,
}

const InstagramIcon = Lucide.Instagram
const GithubIcon = Lucide.Github
const links: {
  li: string
  in: string
  gh: string
  [key: string]: string
} = {
  li: 'https://www.linkedin.com/in/alex-amaral-a45b9ab0/',
  in: 'https://www.instagram.com/alexsamaralns1/',
  gh: 'https://github.com/alexsamaralns',
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    
    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray =[newNote, ...notes]
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value

    setSearch(query)
  }

  function directTo(page: string) {
    if (page) {
      window.open(links[page], '_blank');
    }
  }

  const filteredNote = search !== ''
    ? notes.filter((note) => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 xl:px-0">
      <div className="flex items-center justify-between flex-row w-full">
        <img src={logo} alt="NLW Expert" />
        <div className="flex items-center justify-between flex-row gap-3">
          <Linkedin onClick={() => directTo('li')} className="text-slate-600 hover:cursor-pointer hover:text-slate-300 duration-500" />
          <InstagramIcon onClick={() => directTo('in')} className="text-slate-600 hover:cursor-pointer hover:text-slate-300 duration-500" />
          <GithubIcon onClick={() => directTo('gh')} className="text-slate-600 hover:cursor-pointer hover:text-slate-300 duration-500" />
        </div>
      </div>
      <form className="w-full">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNote.map((note) => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}
