import ThemeToggle from '@/components/ui/nav/ThemeToggle';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50 hidden sm:block">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}