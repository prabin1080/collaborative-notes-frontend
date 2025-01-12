"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/utils/api";
import Navbar from "@/components/Navbar";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [formError, setFormError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${API_BASE_URL}/notes/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      setNotes(await res.json());
    }
  };

  const createNote = async () => {
    setFormError("");
    const res = await fetch(`${API_BASE_URL}/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ title: newNote }),
    });
    if (res.ok) {
      fetchNotes();
      setNewNote("");
    } else if (res.status === 400) {
      const errorData = await res.json();
      setFormError(errorData.title?.[0] || "Invalid input");
    }
  };

  const deleteNote = async (id) => {
    await fetch(`${API_BASE_URL}/notes/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    fetchNotes();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="New note" />
        {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
        <Button onClick={createNote} className="mt-2">Add Note</Button>
        <ul className="mt-4 space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="flex justify-between p-2 border rounded cursor-pointer" onClick={() => router.push(`/notes/edit/${note.id}`)}>
              {note.title}
              <Button onClick={(e) => {e.stopPropagation(); deleteNote(note.id);}} variant="destructive">Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
