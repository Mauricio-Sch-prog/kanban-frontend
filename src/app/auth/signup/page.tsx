"use client"
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignup(e: React.FormEvent) {
      e.preventDefault();

      try {
      await apiFetch("/user", {
        method: "POST",
        body: JSON.stringify({
    name: name,
    email : email,
    password : password
}),

      });

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
    }


    return (
        <div className="flex h-screen items-center justify-center">
            <form 
            onSubmit={handleSignup}
            className="bg-gray-900"
            >

            <Input type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <Input type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <Input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button>Sign Up</button>
            </form>
        </div>
    )
}