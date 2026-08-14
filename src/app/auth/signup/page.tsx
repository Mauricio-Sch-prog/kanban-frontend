'use client';
import Container from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { apiFetch } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 12) {
      return console.log('Password must contain 12 or more characters');
    }

    if (password !== authPassword) {
      return console.log('Confirm your password');
    }

    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  }

  return (
    <Container className="flex h-screen items-center justify-center">
      <form onSubmit={handleSignup} className="bg-gray-900">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Place your name..."
        />

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Place your email..."
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Place your password..."
        />

        <Input
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          placeholder="confirm password..."
        />

        <button>Sign Up</button>
      </form>
    </Container>
  );
}
