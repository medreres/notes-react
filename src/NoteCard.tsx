import React from "react";
import { RawNote, Tag } from "./models/tag";

interface NoteCardProps {
  tags: Tag[]
  title: string;
  id: string
}

const NoteCard = ({ tags, title, id }: NoteCardProps) => {

  return (
    <div className="p-4 border rounded">
      <title>{title}</title>
    </div>
  );
};

export default NoteCard;
