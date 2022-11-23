import { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes, useOutletContext } from "react-router-dom";
import NewNote from "./NewNote";
import useLocalStorage from "./hooks/local-storage";
import { Note, NoteData, RawNote, Tag } from "./models/tag";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import NoteElement from "./NoteElement";
import EditNote from "./EditNote";

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("notes", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("tags", []);

  const notesWithTags = useMemo(
    () =>
      notes.map((note) => ({
        ...note,
        tags: tags.filter((tag) => note.tagsIds.includes(tag.id)),
      })),
    [notes, tags]
  );

  const createNoteHandler = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagsIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const deleteNoteHandler = (id:string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags(prevState => prevState.map(tag => {
      if (tag.id === id) {
        return {id: id, label: label}
      }
      return tag;
    }));
  }

  const deleteTag = (id: string) => {
    setTags(prevState => prevState.filter(tag => tag.id !== id));
  }

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {...note, ...data, tagsIds: tags.map((tag) => tag.id) }
        } else {
          return note;
        }
      })
    });
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList
            updateTag={updateTag}
            deleteTag={deleteTag}
             availableTags={tags}
              notes={notesWithTags} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={createNoteHandler}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<NoteElement onDelete={deleteNoteHandler} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;

export function useNote() {
  return useOutletContext<Note>();
}
