'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => authApi.login(email, password),
    onSuccess: (res) => {
      const { accessToken, user } = res.data;
      setAuth(user, accessToken);
      toast.success(`Bem-vindo, ${user.username}! 🎮`);
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Credenciais inválidas');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-8 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-text-primary">Entrar na Arena</h1>
        <p className="text-sm text-text-tertiary mt-1">Acesse sua conta para competir</p>
      </div>

      <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'E-mail obrigatório',
            pattern: { value: /^\S+@\S+$/, message: 'E-mail inválido' },
          })}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', { required: 'Senha obrigatória' })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loginMutation.isPending}
          className="mt-2"
        >
          <LogIn className="w-4 h-4" />
          Entrar
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="glass-card p-3 text-center">
        <p className="text-xs text-text-muted mb-1 font-semibold">Conta de demonstração</p>
        <p className="text-xs text-text-tertiary font-mono">demo@liga7.gg / demo123</p>
        <button
          type="button"
          onClick={() => {
            loginMutation.mutate({ email: 'demo@liga7.gg', password: 'demo123' });
          }}
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold mt-1 transition-colors"
        >
          Entrar com conta demo →
        </button>
      </div>

      <p className="text-center text-sm text-text-tertiary">
        Não tem conta?{' '}
        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Cadastre-se grátis
        </Link>
      </p>
    </motion.div>
  );
}
