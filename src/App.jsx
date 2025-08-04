import { useState, useEffect } from "react"
import Footer from "./components/Footer"
import Note from "./components/Note"
import Notification from "./components/Notification"
import noteService from "./services/notes"
//import loginService from "./services/login"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  // Para pedirle los datos al "back", que en este caso será al archivo db.json al encender el servidor con el comando: npm run server
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // Para añadir la nota nueva. Se crea un nuevo objeto con la info nueva recogida en el estado del input y este actualiza al objeto que había antes en el estado notes
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote)) // El método concat no cambia el estado original del componente, sino que crea una nueva copia de la lista.
        setNewNote("")
      })
  }

  // Para que el estado cambie cada vez que se escribe en el inputs
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  // Lógica al clicar el botón y mostrar solo las notas importantes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true) // También valdría notes.filter(note => note.important) porque directamente está comprobando que sea true

  // Función para cambiar el booleano de las notas, si son o no importantes
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id) // El método de array find se usa para encontrar la nota que queremos modificar
    const changedNote = { ...note, important: !note.important } // creamos un nuevo objeto que es una copia exacta de la nota anterior, excepto por la propiedad important que tiene su valor cambiado (de true a false o de false a true). En la práctica, { ...note } crea un nuevo objeto con copias de todas las propiedades del objeto note . Cuando agregamos propiedades dentro de las llaves después del objeto extendido, por ejemplo, { ...note, important: true }, entonces el valor de la propiedad important del nuevo objeto será true. En nuestro ejemplo, la propiedad important obtiene la negación de su valor anterior en el objeto original.

    // axios.put(url, changedNote).then(response => { // Podemos reemplazar la nota completa con una solicitud HTTP PUT, o solo cambiar algunas de las propiedades de la nota con una solicitud HTTP PATCH.
    //   setNotes(notes.map(note => note.id !== id ? note : response.data)) // El método map crea una nueva matriz al mapear cada elemento de la matriz anterior a un elemento de la nueva matriz. En nuestro ejemplo, la nueva matriz se crea de forma condicional de modo que si note.id !== id es verdadero, simplemente copiamos el elemento de la matriz anterior en la nueva matriz. Si la condición es falsa, el objeto de nota devuelto por el servidor se agrega a la matriz.
    // })
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => { //error
        setErrorMessage(
          `Note "${note.content}" was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id)) // La eliminación de una nota ya eliminada del estado de la aplicación se realiza con el método de array filter, que devuelve una nueva matriz que comprende solo los elementos de la lista para los cuales la función que se pasó como parámetro devuelve verdadero
      })
  }

  // Función para controlar el login
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {/* user === null ? loginForm() : noteForm() */}
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  )
}

export default App

