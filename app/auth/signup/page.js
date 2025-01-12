"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/utils/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data);
        return;
      }
      
      if (!res.ok) {
        throw new Error("Signup failed");
      }
      
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/notes");
    } catch (error) {
      console.error("Signup failed", error);
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        {errors.username && <p className="text-red-500">{errors.username[0]}</p>}
        <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="mt-2" />
        {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
        {errors.general && <p className="text-red-500">{errors.general}</p>}
        <Button type="submit" className="mt-4 w-full">Sign Up</Button>
      </form>
    </div>
  );
}
