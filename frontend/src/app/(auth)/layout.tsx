import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-DEFAULT">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-ios-lg bg-gradient-brand flex items-center justify-center shadow-brand-lg">
            <Trophy className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">
            <span className="text-gradient-brand">Arena</span>
            <span className="text-text-primary">7</span>
          </span>
        </Link>

        {children}
      </div>
    </div>
  );
}
