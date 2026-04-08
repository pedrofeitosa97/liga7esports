'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Bell, Shield, LogOut, ChevronRight, Moon, Sun, Palette } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function SettingsPage() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sections = [
    {
      title: 'Aparência',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Tema',
          description: theme === 'dark' ? 'Modo escuro ativo' : 'Modo claro ativo',
          action: (
            <button
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-brand-500 transition-all"
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${theme === 'dark' ? 'left-6' : 'left-0.5'}`} />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        { icon: Shield, label: 'Segurança', description: 'Senha e autenticação', action: <ChevronRight className="w-4 h-4 text-text-muted" /> },
        { icon: Bell, label: 'Notificações', description: 'Gerenciar alertas', action: <ChevronRight className="w-4 h-4 text-text-muted" /> },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-text-primary">Configurações</h1>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h2>
          <Card noPadding>
            <div className="divide-y divide-surface-border">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-ios bg-surface-DEFAULT flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}

      {/* Logout */}
      <Button variant="danger" fullWidth onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
        Sair da conta
      </Button>

      <p className="text-center text-xs text-text-muted">Arena7 Esports v1.0.0</p>
    </div>
  );
}
