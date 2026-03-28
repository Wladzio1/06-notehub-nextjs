import axios from "axios";
import type { Note } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string,
): Promise<FetchNotesResponse> {
  const res = await axios.get(BASE_URL, {
    params: { page, perPage, search },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return res.data;
}

export async function createNote(payload: CreateNotePayload) {
  const res = await axios.post(BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return res.data;
}

export async function deleteNote(id: string) {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return res.data;
}
