"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assume username is stored or fetched
      setUser({ username: localStorage.getItem("username")? localStorage.getItem("username"): "Guest"});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">Notes App</h1>
      {user ? (
        <div className="relative">
          <button className="p-2 bg-gray-700 rounded" onMouseEnter={(e) => e.currentTarget.nextSibling.classList.remove('hidden')}>{user.username}</button>
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md hidden" onMouseLeave={(e) => e.currentTarget.classList.add('hidden')}>
            <button onClick={handleLogout} className="block px-4 py-2 w-full text-left">Logout</button>
          </div>
        </div>
      ) : (
        <button onClick={() => router.push("/auth/login")} className="p-2 bg-blue-500 rounded">Login</button>
      )}
    </nav>
  );
}
