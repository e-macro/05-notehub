import axios from "axios";
import type {Note} from "../types/note";
// import { useMutation } from "@tanstack/react-query";

export interface NoteResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteParams {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}


export const fetchNotes = async (page: number, query: string): Promise<NoteResponse> => {
    const params = {
        params:{
        search: query,
        page: page,
        perPage: 12,
    },
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }
    }
    const response = await axios.get<NoteResponse>('https://notehub-public.goit.study/api/notes', params);
    return response.data;
}

export const createNote = async (newNote: CreateNoteParams) => {
    
    const res = await axios.post<NoteResponse>('https://notehub-public.goit.study/api/notes', newNote, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }});
    return res.data;
}

export const deleteNote = async (id: string) => {
    const res = await axios.delete<NoteResponse>(`https://notehub-public.goit.study/api/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }})
    return res.data;
}