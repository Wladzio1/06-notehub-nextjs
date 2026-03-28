"use client";

import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/api";
import Link from "next/link";

export default function NoteList({ notes }: { notes: Note[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>

          <div className={css.footer}>
            <span>{note.tag}</span>

            {/* 🔥 WYMAGANE W ZADANIU */}
            <Link href={`/notes/${note.id}`}>View details</Link>

            <button onClick={() => mutation.mutate(note.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
