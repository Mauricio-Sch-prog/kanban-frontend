import { ErrorResponse } from '@/types/error.response';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  console.log(`${API_URL}${path}`);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    return res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const apiErr = error as ErrorResponse;
      const message = Array.isArray(apiErr.message)
        ? apiErr.message.join(', ')
        : apiErr.error || 'An unexpected error occurred';

      throw new Error(message);
    }

    throw new Error('An unexpected error occurred');
  }
}
