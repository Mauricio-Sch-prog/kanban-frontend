"use client"
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();

      try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
    email : email,
    password : password
}),

      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
    }


    return (
        <Container>
            <form 
            onSubmit={handleLogin}
            className="bg-gray-900"
            >

            <Input type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <Input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button>Login</button>
            </form>
        </Container>
    )
}