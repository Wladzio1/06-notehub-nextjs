"use client";

import { useState } from "react";
import css from "./page.module.css";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";

import { fetchNotes } from "@/lib/api";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false); // ✅ modal state

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {/* ✅ PAGINATION */}
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0 });
            }}
          />
        )}

        {/* ✅ BUTTON DO MODALA */}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes...</p>}

      {data?.notes.length ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}

      {/* ✅ MODAL */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onCancel={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
