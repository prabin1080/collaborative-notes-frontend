const API_URL = "http://127.0.0.1:8000/notes/";

export async function fetchNotes() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
  });
  return res.json();
}

export async function saveNote(note) {
  const method = note.id ? "PUT" : "POST";
  const url = note.id ? `${API_URL}${note.id}/` : API_URL;
  
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(note),
  });

  return res.json();
}
