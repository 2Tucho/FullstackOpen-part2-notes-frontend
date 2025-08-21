import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import NoteForm from "./NoteForm"
import userEvent from "@testing-library/user-event"

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote} />)

    //const { container } = render(<NoteForm createNote={createNote} />)
    //const input = screen.getByRole("textbox") ---> Opción no demasiado aconsejable
    const input = screen.getByPlaceholderText("Write note content here...") //---> Para pillar el elemento por el texto del place holder
    //const input = container.querySelector("#note-input")

    const sendButton = screen.getByText("save")

    await user.type(input, "testing a form...")
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe("testing a form...")
})

