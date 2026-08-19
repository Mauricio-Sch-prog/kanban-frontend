import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import RecaptchaProvider from '@/providers/RecaptchaProvider';
import OAuthProvider from '@/providers/OAuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kanban by Programador_Gaúcho',
  description: 'The perfect site to organize your task, goals and most creative ideas',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OAuthProvider>
            <RecaptchaProvider>
              <QueryProvider>
                {children}
                <Toaster position="top-right" richColors />
              </QueryProvider>
            </RecaptchaProvider>
          </OAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
