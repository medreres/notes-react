import React from "react";
import { useNote } from "./App";
import { NoteData, Tag } from "./models/tag";
import NoteForm from "./NoteForm";

interface EditNoteProps {
  onSubmit: (id: string, { tags, ...data }: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
}

const EditNote = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
  const note = useNote();
  const { title, tags, markdown } = note;
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        title={title}
        tags={tags}
        markdown={markdown}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
};

export default EditNote;
