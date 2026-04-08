import Header from '@/components/layout/Header';
import HomePageContent from './(main)/_HomePageContent';

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <HomePageContent />
      </main>
      <footer className="border-t border-surface-border py-6 text-center">
        <p className="text-xs text-text-muted">
          © 2026 LIGA7ESPORTS · Plataforma de Campeonatos Online
        </p>
      </footer>
    </div>
  );
}
