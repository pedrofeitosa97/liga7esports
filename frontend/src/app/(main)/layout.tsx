import Header from '@/components/layout/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-surface-border py-6 text-center">
        <p className="text-xs text-text-muted">
          © 2026 LIGA7ESPORTS · Plataforma de Campeonatos Online
        </p>
      </footer>
    </div>
  );
}
