'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }: RegisterForm) =>
      authApi.register(username, email, password),
    onSuccess: (res) => {
      const { accessToken, user } = res.data;
      setAuth(user, accessToken);
      toast.success('Conta criada com sucesso! Bem-vindo à Liga7! 🎉');
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao criar conta');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated p-8 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-text-primary">Criar Conta</h1>
        <p className="text-sm text-text-tertiary mt-1">Junte-se a milhares de competidores</p>
      </div>

      <form
        onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
        className="space-y-4"
      >
        <Input
          label="Username"
          placeholder="ProGamer99"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          hint="3-20 caracteres, apenas letras, números e _"
          {...register('username', {
            required: 'Username obrigatório',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            maxLength: { value: 20, message: 'Máximo 20 caracteres' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Apenas letras, números e _',
            },
          })}
        />

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
          placeholder="Mín. 6 caracteres"
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
          {...register('password', {
            required: 'Senha obrigatória',
            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
          })}
        />

        <Input
          label="Confirmar Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repita a senha"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirmação obrigatória',
            validate: (val) => val === watch('password') || 'Senhas não coincidem',
          })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={registerMutation.isPending}
          className="mt-2"
        >
          <Zap className="w-4 h-4" />
          Criar Conta Grátis
        </Button>
      </form>

      <p className="text-center text-sm text-text-tertiary">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Entrar
        </Link>
      </p>
    </motion.div>
  );
}
