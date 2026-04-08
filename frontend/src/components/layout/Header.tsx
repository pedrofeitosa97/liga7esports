'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Bell, Menu, X, Search, LogOut, User, Plus,
  ChevronDown, Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Campeonatos' },
    { href: '/ranking', label: 'Ranking' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border/60 bg-background-DEFAULT/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-ios bg-gradient-brand flex items-center justify-center shadow-brand-lg">
              <Trophy className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-gradient-brand">Arena</span>
              <span className="text-text-primary">7</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-ios text-sm font-semibold transition-all duration-200',
                  pathname === link.href
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-DEFAULT',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-ios flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-DEFAULT transition-all duration-200"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Create button */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/tournaments/create')}
                  className="hidden sm:flex"
                >
                  <Plus className="w-4 h-4" />
                  Criar
                </Button>

                {/* Notifications */}
                <button className="relative w-9 h-9 rounded-ios flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-DEFAULT transition-all duration-200">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-ios-full hover:bg-surface-DEFAULT transition-all duration-200"
                  >
                    <Avatar src={user.avatarUrl} username={user.username} size="sm" />
                    <span className="hidden sm:block text-sm font-semibold text-text-primary max-w-24 truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-tertiary hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-20 w-52 glass-card-elevated p-1.5 space-y-0.5"
                        >
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-ios text-sm text-text-secondary hover:text-text-primary hover:bg-surface-DEFAULT transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Meu Perfil
                          </Link>
                          <Link
                            href="/tournaments/create"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-ios text-sm text-text-secondary hover:text-text-primary hover:bg-surface-DEFAULT transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Criar Campeonato
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-ios text-sm text-text-secondary hover:text-text-primary hover:bg-surface-DEFAULT transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Configurações
                          </Link>
                          <div className="border-t border-surface-border my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-ios text-sm text-accent-red hover:bg-accent-red/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Entrar
                </Button>
                <Button variant="primary" size="sm" onClick={() => router.push('/register')}>
                  Cadastrar
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-ios flex items-center justify-center text-text-secondary hover:bg-surface-DEFAULT transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <input
                autoFocus
                placeholder="Buscar campeonatos, jogos..."
                className="w-full px-4 py-2.5 rounded-ios bg-surface-DEFAULT border border-surface-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/?search=${e.currentTarget.value}`);
                    setSearchOpen(false);
                  }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-4 space-y-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-2.5 rounded-ios text-sm font-semibold transition-all',
                    pathname === link.href
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-DEFAULT',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/tournaments/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-ios text-sm font-semibold text-brand-400"
                >
                  <Plus className="w-4 h-4" />
                  Criar Campeonato
                </Link>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
