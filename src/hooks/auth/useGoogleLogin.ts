import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CredentialResponse } from '@react-oauth/google';

export function useGoogleLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        return;
      }

      const response = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success('Logged successfully!');
      router.push('/auth/login');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
