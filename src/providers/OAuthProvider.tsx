import { GoogleOAuthProvider } from '@react-oauth/google';

export default function OAuthProvider({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.PUBLIC_GOOGLE_CLIENT_ID ?? '';
  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
}
