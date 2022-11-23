import { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./NewNote";
import useLocalStorage from "./hooks/local-storage";
import { NoteData, RawNote, Tag } from "./models/tag";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";

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

  console.log(notesWithTags)

  const createNoteHandler = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagsIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList availableTags={tags}
        notes={notesWithTags} />} />
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
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
