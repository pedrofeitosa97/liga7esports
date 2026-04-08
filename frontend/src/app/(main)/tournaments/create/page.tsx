'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Trophy, ChevronLeft, Gamepad2, Settings, DollarSign,
  Calendar, Users, FileText, Image, Gift, Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tournamentsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { SUPPORTED_GAMES } from '@/lib/constants';

interface FormData {
  title: string;
  game: string;
  description: string;
  format: string;
  maxPlayers: string;
  entryFee: string;
  prize: string;
  rules: string;
  startDate: string;
}

const formatOptions = [
  { value: 'MATA_MATA', label: '⚡ Mata-Mata (Eliminação Simples)' },
  { value: 'GRUPOS', label: '🏆 Fase de Grupos' },
  { value: 'PONTOS_CORRIDOS', label: '📊 Pontos Corridos' },
];

const playerOptions = [2, 4, 8, 16, 32, 64, 128].map((n) => ({
  value: String(n),
  label: `${n} jogadores`,
}));

const steps = [
  { id: 1, label: 'Jogo', icon: Gamepad2 },
  { id: 2, label: 'Formato', icon: Settings },
  { id: 3, label: 'Detalhes', icon: FileText },
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      maxPlayers: '16',
      format: 'MATA_MATA',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      tournamentsApi.create({
        title: data.title,
        game: data.game,
        description: data.description || undefined,
        format: data.format,
        maxPlayers: Number(data.maxPlayers),
        entryFee: data.entryFee ? Number(data.entryFee) : undefined,
        prize: data.prize || undefined,
        rules: data.rules || undefined,
        startDate: data.startDate || undefined,
      }),
    onSuccess: (res) => {
      toast.success('Campeonato criado com sucesso!');
      router.push(`/tournaments/${res.data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao criar campeonato');
    },
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) fieldsToValidate = ['game'];
    if (step === 2) fieldsToValidate = ['format', 'maxPlayers'];
    if (step === 3) fieldsToValidate = ['title'];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const selectedGame = SUPPORTED_GAMES.find((g) => g.id === watch('game'));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.back())}
          className="w-10 h-10 rounded-ios bg-surface-DEFAULT border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">Criar Campeonato</h1>
          <p className="text-sm text-text-tertiary">Configure seu torneio personalizado</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-ios transition-all ${
                step === s.id
                  ? 'bg-brand-500/15 border border-brand-500/40 text-brand-400'
                  : step > s.id
                  ? 'text-accent-green'
                  : 'text-text-muted'
              }`}
            >
              {step > s.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
              <span className="text-xs font-bold hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${step > s.id ? 'bg-accent-green/40' : 'bg-surface-border'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Choose game */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Escolha o jogo</h2>
              <p className="text-sm text-text-tertiary">Qual jogo será disputado no campeonato?</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUPPORTED_GAMES.map((game) => {
                const selected = watch('game') === game.id;
                return (
                  <label
                    key={game.id}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-ios-lg border cursor-pointer transition-all ${
                      selected
                        ? 'bg-brand-500/15 border-brand-500/50 text-brand-400'
                        : 'bg-surface-DEFAULT border-surface-border text-text-secondary hover:border-surface-border-light hover:text-text-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      value={game.id}
                      {...register('game', { required: 'Selecione um jogo' })}
                      className="sr-only"
                    />
                    <span className="text-3xl">{game.icon}</span>
                    <span className="text-xs font-semibold text-center leading-tight">{game.name}</span>
                    {selected && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {errors.game && <p className="text-xs text-accent-red">{errors.game.message}</p>}
          </motion.div>
        )}

        {/* Step 2: Format */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Formato do torneio</h2>
              <p className="text-sm text-text-tertiary">Como as partidas serão organizadas?</p>
            </div>

            <div className="space-y-3">
              {formatOptions.map((opt) => {
                const selected = watch('format') === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-ios-lg border cursor-pointer transition-all ${
                      selected
                        ? 'bg-brand-500/15 border-brand-500/50'
                        : 'bg-surface-DEFAULT border-surface-border hover:border-surface-border-light'
                    }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('format', { required: true })}
                      className="sr-only"
                    />
                    <span className="text-2xl">{opt.label.split(' ')[0]}</span>
                    <span className={`font-semibold text-sm ${selected ? 'text-brand-400' : 'text-text-primary'}`}>
                      {opt.label.slice(3)}
                    </span>
                    {selected && (
                      <div className="ml-auto w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>

            <Select
              label="Número máximo de jogadores"
              options={playerOptions}
              {...register('maxPlayers')}
              leftIcon={<Users className="w-4 h-4" />}
            />
          </motion.div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Detalhes do campeonato</h2>
              <p className="text-sm text-text-tertiary">Adicione informações para atrair participantes</p>
            </div>

            <Input
              label="Nome do campeonato *"
              placeholder={`Copa ${selectedGame?.name || 'Liga7'} 2026`}
              error={errors.title?.message}
              leftIcon={<Trophy className="w-4 h-4" />}
              {...register('title', {
                required: 'Nome obrigatório',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 100, message: 'Máximo 100 caracteres' },
              })}
            />

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Descrição
              </label>
              <textarea
                placeholder="Descreva seu campeonato..."
                rows={3}
                className="w-full px-4 py-3 rounded-ios bg-surface-DEFAULT border border-surface-border text-text-primary placeholder:text-text-muted text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Taxa de inscrição (R$)"
                type="number"
                placeholder="0 = gratuito"
                leftIcon={<DollarSign className="w-4 h-4" />}
                hint="Deixe em branco para gratuito"
                {...register('entryFee', { min: { value: 0, message: 'Mínimo 0' } })}
              />
              <Input
                label="Prêmio"
                placeholder="R$ 500 + Trophy"
                leftIcon={<Gift className="w-4 h-4" />}
                {...register('prize')}
              />
            </div>

            <Input
              label="Data de início"
              type="datetime-local"
              leftIcon={<Calendar className="w-4 h-4" />}
              {...register('startDate')}
            />

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Regras do campeonato
              </label>
              <textarea
                placeholder="Descreva as regras, formato de partidas, critérios de desempate..."
                rows={5}
                className="w-full px-4 py-3 rounded-ios bg-surface-DEFAULT border border-surface-border text-text-primary placeholder:text-text-muted text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                {...register('rules')}
              />
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step < 3 ? (
            <Button type="button" onClick={nextStep} fullWidth size="lg">
              Continuar
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={createMutation.isPending}
            >
              <Trophy className="w-5 h-5" />
              Criar Campeonato
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
