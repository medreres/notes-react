import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Note } from "./models/tag";

interface NoteLayoutProps {
  notes: Note[];
}

const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();

  const note = notes.find((note) => note.id === id);

  if (typeof note === 'undefined') {
    return <Navigate to="/" replace/>;
  }
  return <Outlet context={note} />;
};

export default NoteLayout;
