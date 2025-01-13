'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../auth/context';
import Toast from '../components/Toast';
import { useRecaptcha } from '../hooks/useRecaptcha';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  const { executeRecaptcha } = useRecaptcha();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPasswordError('');

    // Validate password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const captchaToken = await executeRecaptcha('login');

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, captchaToken  }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess('Login successful! Redirecting...');
      login(data.token, data.user);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
      <div className="flex-[3] bg-cover bg-center" style={{ backgroundImage: "url('/login_bg.jpg')" }}>
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-xl w-full space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full rounded-md border ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm p-2`}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
            <p className="text-center">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-600">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-[2] bg-white flex items-center">
        <div className="ml-16">
          <p className="text-3xl font-bold">Surge SE Internship</p>
          <p className="text-3xl mt-2">January 2025</p>
          <p className="text-3xl font-semibold mt-8"><i>Faizan Muthaliff</i></p>
        </div>
      </div>
    </div>
  );
}
