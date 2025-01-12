"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, WS_BASE_URL } from "@/utils/api";
import Navbar from "@/components/Navbar";

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // if (!token) {
    //   router.push("/auth/login");
    //   return;
    // }
    fetchNote();
    connectWebSocket();
  }, [id]);

  const fetchNote = async () => {
    const res = await fetch(`${API_BASE_URL}/notes/${id}/`, {
      // headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      setNote(await res.json());
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket(`${WS_BASE_URL}/${id}/?token=${token}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.content) {
        setNote(data);
      } else if (data.type === "user_list") {
        setOnlineUsers(data.users);
      }
    };
    setWs(socket);
  };

  const updateNote = (field, value) => {
    const updatedNote = { ...note, [field]: value };
    setNote(updatedNote);
    if (ws) {
      ws.send(JSON.stringify(updatedNote));
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
        <Input value={note.title} onChange={(e) => updateNote("title", e.target.value)} placeholder="Title" />
        <textarea className="w-full mt-2 p-2 border rounded" value={note.content} onChange={(e) => updateNote("content", e.target.value)} placeholder="Content" />
        <div className="mt-4 flex space-x-2">
          {onlineUsers.map((user) => (
            <div key={user} className="relative w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer" title={user}>
              {user[0].toUpperCase()}
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden bg-black text-white text-xs p-1 rounded opacity-80">{user}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
