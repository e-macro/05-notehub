import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import {useQuery, keepPreviousData, useQueryClient, useMutation} from "@tanstack/react-query";
import {useDebouncedCallback} from "use-debounce";
import {createNote, fetchNotes, deleteNote} from "../../services/noteService";
import type {CreateNoteParams} from "../../services/noteService";
import {useState} from "react";
import type {NoteResponse} from "../../services/noteService";
import css from "./App.module.css";
import type { Note } from "../../types/notes";

export default function App() {
  const client = useQueryClient();
  
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const updateSearchQuery = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => 
  setQuery(e.target.value), 300);
  const { data } = useQuery<NoteResponse>({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(page, query),
    placeholderData: keepPreviousData,
  })
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes', query, page] });
    },
  })
const createNewNote = (newNote: CreateNoteParams) => {
    createNoteMutation.mutate(newNote);
    closeModal();
}
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes', query, page] })
    }
  });
  const handleDeleteNote = (note: Note) =>{
    deleteNoteMutation.mutate(note.id);
  }
  const totalPages = data?.totalPages || 0;
  return (
    <div className={css.app}>
	<header className={css.toolbar}>
		<SearchBox searchQuery={query} onUpdate={updateSearchQuery}/>
		{totalPages> 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage}/>}
		<button className={css.button} onClick={openModal}>Create note +</button>
  </header>
  {isModalOpen && <Modal onClose={closeModal}>
    <NoteForm onSubmit={createNewNote} onClose={closeModal}/>
  </Modal>}
  {data?.notes && <NoteList onDelete={handleDeleteNote} notes={data?.notes}/>}
</div>

  );
}