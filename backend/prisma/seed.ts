import { PrismaClient, TournamentFormat, TournamentStatus, MatchStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Limpar dados anteriores (ordem reversa de dependência) ────────────────
  await prisma.userBadge.deleteMany();
  await prisma.match.deleteMany();
  await prisma.round.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados anteriores removidos');

  // ── Badges ────────────────────────────────────────────────────────────────
  const [b1, b2, b3, b4, b5] = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Primeiro Campeonato',
        description: 'Criou seu primeiro campeonato',
        imageUrl: '/badges/first-tournament.svg',
        condition: 'CREATE_TOURNAMENT',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Campeão',
        description: 'Venceu um campeonato',
        imageUrl: '/badges/champion.svg',
        condition: 'WIN_TOURNAMENT',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Veterano',
        description: 'Participou de 10 campeonatos',
        imageUrl: '/badges/veteran.svg',
        condition: 'JOIN_10_TOURNAMENTS',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Invicto',
        description: 'Venceu 5 partidas consecutivas',
        imageUrl: '/badges/undefeated.svg',
        condition: 'WIN_5_CONSECUTIVE',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Organizador Elite',
        description: 'Criou 5 campeonatos',
        imageUrl: '/badges/elite-organizer.svg',
        condition: 'CREATE_5_TOURNAMENTS',
      },
    }),
  ]);

  console.log('🏅 Badges criadas');

  // ── Usuários ──────────────────────────────────────────────────────────────
  const hash = (pw: string) => bcrypt.hash(pw, 10);

  const [demo, p1, p2, p3, p4, p5, p6, p7, p8] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'Liga7Demo',
        email: 'demo@liga7.gg',
        password: await hash('demo123'),
        gamesPlayed: 20,
        wins: 13,
        losses: 7,
      },
    }),
    prisma.user.create({
      data: {
        username: 'KingOfFC',
        email: 'king@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 18,
        wins: 11,
        losses: 7,
      },
    }),
    prisma.user.create({
      data: {
        username: 'ValorantPro',
        email: 'valo@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 15,
        wins: 9,
        losses: 6,
      },
    }),
    prisma.user.create({
      data: {
        username: 'SniperElite',
        email: 'sniper@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 12,
        wins: 7,
        losses: 5,
      },
    }),
    prisma.user.create({
      data: {
        username: 'DragonSlayer',
        email: 'dragon@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 10,
        wins: 4,
        losses: 6,
      },
    }),
    prisma.user.create({
      data: {
        username: 'NightStalker',
        email: 'night@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 14,
        wins: 8,
        losses: 6,
      },
    }),
    prisma.user.create({
      data: {
        username: 'PhoenixRise',
        email: 'phoenix@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 8,
        wins: 3,
        losses: 5,
      },
    }),
    prisma.user.create({
      data: {
        username: 'TigerClaw',
        email: 'tiger@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 16,
        wins: 10,
        losses: 6,
      },
    }),
    prisma.user.create({
      data: {
        username: 'IronFist',
        email: 'iron@liga7.gg',
        password: await hash('senha123'),
        gamesPlayed: 11,
        wins: 5,
        losses: 6,
      },
    }),
  ]);

  console.log('👥 9 usuários criados');

  // ─────────────────────────────────────────────────────────────────────────
  // TORNEIO 1 — Copa Liga7 FC 26 (MATA_MATA, 8 jogadores)
  // Bracket: Quartas → Semis → Final
  // ─────────────────────────────────────────────────────────────────────────
  const t1 = await prisma.tournament.create({
    data: {
      title: 'Copa Liga7 FC 26 — Abril 2026',
      game: 'ea-fc-26',
      description: 'O maior torneio de EA Sports FC 26 da plataforma. Eliminação direta com 8 jogadores.',
      creatorId: demo.id,
      format: TournamentFormat.MATA_MATA,
      status: TournamentStatus.EM_ANDAMENTO,
      maxPlayers: 8,
      prize: 'R$ 500 em créditos + Troféu Digital',
      entryFee: null,
      rules: '1. Partidas em casa e fora\n2. 90 min regulamentares\n3. Prorrogação e pênaltis se empate\n4. Sem modificações após inscrição',
    },
  });

  // Registrations t1
  await prisma.registration.createMany({
    data: [demo, p1, p2, p3, p4, p5, p6, p7].map((u) => ({
      userId: u.id,
      tournamentId: t1.id,
    })),
  });

  // Rodada 1 — Quartas de Final
  const r1q = await prisma.round.create({
    data: { tournamentId: t1.id, roundNumber: 1, name: 'Quartas de Final' },
  });

  // Q1: demo vs p7 — demo wins 3-1 ✅
  const mQ1 = await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1q.id,
      player1Id: demo.id,
      player2Id: p7.id,
      score1: 3,
      score2: 1,
      winnerId: demo.id,
      status: MatchStatus.FINALIZADO,
    },
  });

  // Q2: p1 vs p6 — p1 wins 2-0 ✅
  const mQ2 = await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1q.id,
      player1Id: p1.id,
      player2Id: p6.id,
      score1: 2,
      score2: 0,
      winnerId: p1.id,
      status: MatchStatus.FINALIZADO,
    },
  });

  // Q3: p5 vs p2 — p5 wins 1-0 (virada!) ✅
  const mQ3 = await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1q.id,
      player1Id: p5.id,
      player2Id: p2.id,
      score1: 1,
      score2: 0,
      winnerId: p5.id,
      status: MatchStatus.FINALIZADO,
    },
  });

  // Q4: p3 vs p4 — em andamento, 1-1
  const mQ4 = await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1q.id,
      player1Id: p3.id,
      player2Id: p4.id,
      score1: 1,
      score2: 1,
      status: MatchStatus.EM_ANDAMENTO,
    },
  });

  // Rodada 2 — Semifinais
  const r1s = await prisma.round.create({
    data: { tournamentId: t1.id, roundNumber: 2, name: 'Semifinais' },
  });

  // S1: demo vs p1 — demo wins 2-1 ✅
  await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1s.id,
      player1Id: demo.id,
      player2Id: p1.id,
      score1: 2,
      score2: 1,
      winnerId: demo.id,
      status: MatchStatus.FINALIZADO,
    },
  });

  // S2: p5 vs vencedor Q4 — pendente
  await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1s.id,
      player1Id: p5.id,
      player2Id: null, // aguardando Q4
      status: MatchStatus.PENDENTE,
    },
  });

  // Rodada 3 — Final
  const r1f = await prisma.round.create({
    data: { tournamentId: t1.id, roundNumber: 3, name: 'Final' },
  });

  // F1: demo vs TBD — pendente
  await prisma.match.create({
    data: {
      tournamentId: t1.id,
      roundId: r1f.id,
      player1Id: demo.id,
      player2Id: null,
      status: MatchStatus.PENDENTE,
    },
  });

  console.log('🏆 Torneio 1 (MATA_MATA) criado — Quartas/Semis/Final');

  // ─────────────────────────────────────────────────────────────────────────
  // TORNEIO 2 — Valorant Weekly Cup (GRUPOS, 8 jogadores, 2 grupos de 4)
  // ─────────────────────────────────────────────────────────────────────────
  const t2 = await prisma.tournament.create({
    data: {
      title: 'Copa eFootball 2025 — Grupos',
      game: 'efootball-2025',
      description: 'Torneio semanal em formato de grupos. Os 2 primeiros de cada grupo avançam.',
      creatorId: demo.id,
      format: TournamentFormat.GRUPOS,
      status: TournamentStatus.EM_ANDAMENTO,
      maxPlayers: 8,
      entryFee: 25,
      prize: 'R$ 1.000 para o vencedor',
      rules: '1. BO3 nas semis e final\n2. Veto de mapas obrigatório\n3. Sem smurfing',
    },
  });

  // Registrations t2: p1-p8
  await prisma.registration.createMany({
    data: [p1, p2, p3, p4, p5, p6, p7, p8].map((u) => ({
      userId: u.id,
      tournamentId: t2.id,
    })),
  });

  // ── Grupo A: p1, p2, p3, p4 ──────────────────────────────────────────────
  const r2a = await prisma.round.create({
    data: { tournamentId: t2.id, roundNumber: 1, name: 'Grupo A' },
  });

  // Classificação atual Grupo A:
  //   p1: 2V 1D = 6pts   p2: 2V 1D = 6pts   p3: 1V 2D = 3pts   p4: 0V 3D = 0pts (aguarda 1 jogo)
  await prisma.match.createMany({
    data: [
      // p1 vs p2 → p1 wins 2-1 ✅
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p1.id, player2Id: p2.id,
        score1: 2, score2: 1, winnerId: p1.id,
        status: MatchStatus.FINALIZADO,
      },
      // p1 vs p3 → p3 wins 1-0 (virada!) ✅
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p1.id, player2Id: p3.id,
        score1: 0, score2: 1, winnerId: p3.id,
        status: MatchStatus.FINALIZADO,
      },
      // p1 vs p4 → p1 wins 3-2 ✅
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p1.id, player2Id: p4.id,
        score1: 3, score2: 2, winnerId: p1.id,
        status: MatchStatus.FINALIZADO,
      },
      // p2 vs p3 → p2 wins 2-0 ✅
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p2.id, player2Id: p3.id,
        score1: 2, score2: 0, winnerId: p2.id,
        status: MatchStatus.FINALIZADO,
      },
      // p2 vs p4 → p4 wins 1-0 (virada!) ✅
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p2.id, player2Id: p4.id,
        score1: 0, score2: 1, winnerId: p4.id,
        status: MatchStatus.FINALIZADO,
      },
      // p3 vs p4 → PENDENTE (jogo decisivo!)
      {
        tournamentId: t2.id, roundId: r2a.id,
        player1Id: p3.id, player2Id: p4.id,
        status: MatchStatus.PENDENTE,
      },
    ],
  });

  // ── Grupo B: p5, p6, p7, p8 ──────────────────────────────────────────────
  const r2b = await prisma.round.create({
    data: { tournamentId: t2.id, roundNumber: 2, name: 'Grupo B' },
  });

  // Classificação atual Grupo B:
  //   p6: 3V 0D = 9pts   p5: 1V 1D 1? = 3pts   p7: 1V 2D = 3pts   p8: ? (pendente)
  await prisma.match.createMany({
    data: [
      // p5 vs p6 → p6 wins 2-1 ✅
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p5.id, player2Id: p6.id,
        score1: 1, score2: 2, winnerId: p6.id,
        status: MatchStatus.FINALIZADO,
      },
      // p5 vs p7 → p5 wins 3-1 ✅
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p5.id, player2Id: p7.id,
        score1: 3, score2: 1, winnerId: p5.id,
        status: MatchStatus.FINALIZADO,
      },
      // p5 vs p8 → PENDENTE
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p5.id, player2Id: p8.id,
        status: MatchStatus.PENDENTE,
      },
      // p6 vs p7 → p6 wins 2-0 ✅
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p6.id, player2Id: p7.id,
        score1: 2, score2: 0, winnerId: p6.id,
        status: MatchStatus.FINALIZADO,
      },
      // p6 vs p8 → EM_ANDAMENTO
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p6.id, player2Id: p8.id,
        status: MatchStatus.EM_ANDAMENTO,
      },
      // p7 vs p8 → p7 wins 1-0 ✅
      {
        tournamentId: t2.id, roundId: r2b.id,
        player1Id: p7.id, player2Id: p8.id,
        score1: 1, score2: 0, winnerId: p7.id,
        status: MatchStatus.FINALIZADO,
      },
    ],
  });

  console.log('🎯 Torneio 2 (GRUPOS) criado — Grupo A e B com 6 partidas cada');

  // ─────────────────────────────────────────────────────────────────────────
  // TORNEIO 3 — Liga Fortnite Solo (PONTOS_CORRIDOS, 6 jogadores)
  // Round-robin completo: 15 partidas em 5 rodadas
  // ─────────────────────────────────────────────────────────────────────────
  const t3 = await prisma.tournament.create({
    data: {
      title: 'Liga FIFA 23 — Temporada 2',
      game: 'fifa-23',
      description: 'Campeonato pontos corridos, todos jogam contra todos. O mais consistente vence.',
      creatorId: demo.id,
      format: TournamentFormat.PONTOS_CORRIDOS,
      status: TournamentStatus.EM_ANDAMENTO,
      maxPlayers: 6,
      entryFee: null,
      prize: 'V-Bucks + Badge Exclusivo',
      rules: '1. Pontuação: 3 pts vitória, 0 pts derrota\n2. 3 partidas por rodada\n3. Sem construção extra',
    },
  });

  // Registrations t3: demo, p1, p3, p5, p7, p8
  const t3players = [demo, p1, p3, p5, p7, p8];
  await prisma.registration.createMany({
    data: t3players.map((u) => ({ userId: u.id, tournamentId: t3.id })),
  });

  // ── Rodada 1 (3 partidas, todas FINALIZADAS) ──────────────────────────────
  const r3_1 = await prisma.round.create({
    data: { tournamentId: t3.id, roundNumber: 1, name: 'Rodada 1' },
  });
  await prisma.match.createMany({
    data: [
      // demo vs p8 → demo wins ✅
      {
        tournamentId: t3.id, roundId: r3_1.id,
        player1Id: demo.id, player2Id: p8.id,
        score1: 1, score2: 0, winnerId: demo.id,
        status: MatchStatus.FINALIZADO,
      },
      // p1 vs p7 → p7 wins ✅
      {
        tournamentId: t3.id, roundId: r3_1.id,
        player1Id: p1.id, player2Id: p7.id,
        score1: 0, score2: 1, winnerId: p7.id,
        status: MatchStatus.FINALIZADO,
      },
      // p3 vs p5 → p3 wins ✅
      {
        tournamentId: t3.id, roundId: r3_1.id,
        player1Id: p3.id, player2Id: p5.id,
        score1: 1, score2: 0, winnerId: p3.id,
        status: MatchStatus.FINALIZADO,
      },
    ],
  });

  // ── Rodada 2 (3 partidas, todas FINALIZADAS) ──────────────────────────────
  const r3_2 = await prisma.round.create({
    data: { tournamentId: t3.id, roundNumber: 2, name: 'Rodada 2' },
  });
  await prisma.match.createMany({
    data: [
      // demo vs p7 → demo wins ✅
      {
        tournamentId: t3.id, roundId: r3_2.id,
        player1Id: demo.id, player2Id: p7.id,
        score1: 1, score2: 0, winnerId: demo.id,
        status: MatchStatus.FINALIZADO,
      },
      // p1 vs p5 → p5 wins ✅
      {
        tournamentId: t3.id, roundId: r3_2.id,
        player1Id: p1.id, player2Id: p5.id,
        score1: 0, score2: 1, winnerId: p5.id,
        status: MatchStatus.FINALIZADO,
      },
      // p3 vs p8 → p3 wins ✅
      {
        tournamentId: t3.id, roundId: r3_2.id,
        player1Id: p3.id, player2Id: p8.id,
        score1: 1, score2: 0, winnerId: p3.id,
        status: MatchStatus.FINALIZADO,
      },
    ],
  });

  // ── Rodada 3 (1 em andamento, 2 pendentes) ────────────────────────────────
  const r3_3 = await prisma.round.create({
    data: { tournamentId: t3.id, roundNumber: 3, name: 'Rodada 3' },
  });
  await prisma.match.createMany({
    data: [
      // demo vs p5 → EM_ANDAMENTO
      {
        tournamentId: t3.id, roundId: r3_3.id,
        player1Id: demo.id, player2Id: p5.id,
        status: MatchStatus.EM_ANDAMENTO,
      },
      // p1 vs p3 → PENDENTE
      {
        tournamentId: t3.id, roundId: r3_3.id,
        player1Id: p1.id, player2Id: p3.id,
        status: MatchStatus.PENDENTE,
      },
      // p7 vs p8 → PENDENTE
      {
        tournamentId: t3.id, roundId: r3_3.id,
        player1Id: p7.id, player2Id: p8.id,
        status: MatchStatus.PENDENTE,
      },
    ],
  });

  // ── Rodada 4 (todas PENDENTES) ────────────────────────────────────────────
  const r3_4 = await prisma.round.create({
    data: { tournamentId: t3.id, roundNumber: 4, name: 'Rodada 4' },
  });
  await prisma.match.createMany({
    data: [
      { tournamentId: t3.id, roundId: r3_4.id, player1Id: demo.id, player2Id: p3.id, status: MatchStatus.PENDENTE },
      { tournamentId: t3.id, roundId: r3_4.id, player1Id: p1.id,  player2Id: p8.id, status: MatchStatus.PENDENTE },
      { tournamentId: t3.id, roundId: r3_4.id, player1Id: p5.id,  player2Id: p7.id, status: MatchStatus.PENDENTE },
    ],
  });

  // ── Rodada 5 (todas PENDENTES) ────────────────────────────────────────────
  const r3_5 = await prisma.round.create({
    data: { tournamentId: t3.id, roundNumber: 5, name: 'Rodada 5' },
  });
  await prisma.match.createMany({
    data: [
      { tournamentId: t3.id, roundId: r3_5.id, player1Id: demo.id, player2Id: p1.id, status: MatchStatus.PENDENTE },
      { tournamentId: t3.id, roundId: r3_5.id, player1Id: p3.id,  player2Id: p7.id, status: MatchStatus.PENDENTE },
      { tournamentId: t3.id, roundId: r3_5.id, player1Id: p5.id,  player2Id: p8.id, status: MatchStatus.PENDENTE },
    ],
  });

  console.log('🎮 Torneio 3 (PONTOS_CORRIDOS) criado — 5 rodadas, 15 partidas');

  // ─────────────────────────────────────────────────────────────────────────
  // TORNEIO 4 — Bônus: torneio ABERTO (sem bracket ainda, para testar inscrições)
  // ─────────────────────────────────────────────────────────────────────────
  const t4 = await prisma.tournament.create({
    data: {
      title: 'EA Sports FC 25 — Copa Maio',
      game: 'ea-fc-25',
      description: 'Inscrições abertas para o torneio de EA FC 25. Formato mata-mata com 8 vagas.',
      creatorId: p1.id,
      format: TournamentFormat.MATA_MATA,
      status: TournamentStatus.ABERTO,
      maxPlayers: 8,
      entryFee: 15,
      prize: 'R$ 300 + Medalha Digital',
      rules: '1. Partidas BO3\n2. Prorrogação e pênaltis se empate\n3. Sem modificações de equipe',
    },
  });

  await prisma.registration.createMany({
    data: [p1, p2, p3, demo].map((u) => ({ userId: u.id, tournamentId: t4.id })),
  });

  console.log('🔓 Torneio 4 (ABERTO) criado — aguardando mais inscrições');

  // ── Badges para o demo ────────────────────────────────────────────────────
  await prisma.userBadge.createMany({
    data: [
      { userId: demo.id, badgeId: b1.id },
      { userId: demo.id, badgeId: b2.id },
      { userId: demo.id, badgeId: b4.id },
      { userId: p1.id,   badgeId: b1.id },
      { userId: p3.id,   badgeId: b3.id },
    ],
  });

  // ── Resumo ────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed concluído!\n');
  console.log('👤 Usuários:');
  console.log('   demo@liga7.gg   / demo123   → Liga7Demo');
  console.log('   king@liga7.gg   / senha123  → KingOfFC');
  console.log('   valo@liga7.gg   / senha123  → ValorantPro');
  console.log('   sniper@liga7.gg / senha123  → SniperElite');
  console.log('   dragon@liga7.gg / senha123  → DragonSlayer');
  console.log('   night@liga7.gg  / senha123  → NightStalker');
  console.log('   phoenix@liga7.gg/ senha123  → PhoenixRise');
  console.log('   tiger@liga7.gg  / senha123  → TigerClaw');
  console.log('   iron@liga7.gg   / senha123  → IronFist');
  console.log('\n🏟️  Torneios:');
  console.log('   [1] Copa FC 26       — MATA_MATA    — EM_ANDAMENTO — Quartas/Semis/Final');
  console.log('   [2] Valorant Weekly  — GRUPOS       — EM_ANDAMENTO — Grupo A + Grupo B');
  console.log('   [3] Liga Fortnite    — PONTOS_CORR. — EM_ANDAMENTO — 5 rodadas, 15 partidas');
  console.log('   [4] Rocket League    — MATA_MATA    — ABERTO       — aguardando inscrições');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
