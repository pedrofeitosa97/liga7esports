import Link from 'next/link';
import { Trophy, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-ios-xl bg-brand-500/10 flex items-center justify-center mb-6">
        <Trophy className="w-10 h-10 text-brand-400 opacity-60" />
      </div>
      <h1 className="text-6xl font-extrabold text-gradient-brand mb-3">404</h1>
      <h2 className="text-xl font-bold text-text-primary mb-2">Página não encontrada</h2>
      <p className="text-sm text-text-muted mb-8 max-w-xs">
        Esta página não existe ou foi movida. Volte ao início e continue competindo!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-ios-full bg-gradient-brand text-white font-semibold text-sm shadow-brand hover:shadow-brand-lg transition-all"
      >
        <Home className="w-4 h-4" />
        Voltar ao Início
      </Link>
    </div>
  );
}
