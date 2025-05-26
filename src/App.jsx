import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  // Para pedirle los datos al "back", que en este caso será al archivo db.json al encender el servidor con el comando: npm run server
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // Para añadir la nota nueva. Se crea un nuevo objeto con la info nueva recogida en el estado del input y este actualiza al objeto que había antes en el estado notes
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }

    setNotes(notes.concat(noteObject))
    setNewNote('') //A cero para que se pueda rellenar de nuevo
  }

  // Para que el estado cambie cada vez que se escribe en el inputs
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  // Lógica al clicar el botón y mostrar solo las notas importantes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true) // También valdría notes.filter(note => note.important) porque directamente está comprobando que sea true

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App

