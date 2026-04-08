# LIGA7ESPORTS — Plataforma de Campeonatos

Plataforma completa de campeonatos de jogos virtuais (EA Sports FC 26, Valorant, Fortnite, etc.), inspirada no Battlefy. Design iOS moderno com fonte Manrope.

## Stack Técnico

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React, Tailwind CSS, Zustand, TanStack Query, Framer Motion |
| Backend | NestJS, Prisma ORM, JWT Auth, Swagger |
| Banco | PostgreSQL |
| Tipagem | TypeScript (monorepo compartilhado) |
| UI | Design iOS, fonte Manrope, tema escuro/claro |

---

## Estrutura do Projeto

```
liga7esports-monorepo/
├── frontend/          → Next.js 14 (porta 3000)
├── backend/           → NestJS (porta 3001)
├── shared/            → Tipos TypeScript compartilhados
└── package.json       → Workspaces NPM
```

---

## Configuração Rápida

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm 8+

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar banco de dados

Crie um banco PostgreSQL e configure a string de conexão:

```bash
# backend/.env (já criado como exemplo)
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/liga7esports?schema=public"
JWT_SECRET="seu-secret-aqui"
```

### 4. Rodar migrations e seed

```bash
cd backend
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

Isso cria as tabelas e popula com dados de exemplo, incluindo:
- Conta demo: `demo@liga7.gg` / `demo123`
- 3 campeonatos de demonstração
- 5 badges de exemplo

### 5. Iniciar os servidores

```bash
# Da raiz do projeto — inicia backend + frontend juntos:
npm run dev

# Ou separadamente:
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:3000
```

### 6. Documentação da API (Swagger)

Acesse: `http://localhost:3001/api/docs`

---

## Funcionalidades

### Usuários
- [x] Cadastro e login com JWT
- [x] Perfil com avatar (upload de imagem)
- [x] Estatísticas (vitórias, derrotas, win rate)
- [x] Sistema de insígnias/badges
- [x] Ranking global

### Campeonatos
- [x] Criar campeonatos personalizados (3 etapas guiadas)
- [x] Suporte a 11 jogos (EA FC 26, Valorant, Fortnite, etc.)
- [x] 3 formatos: Mata-Mata, Grupos, Pontos Corridos
- [x] Inscrição gratuita ou paga (taxa de entrada)
- [x] Geração automática de chaves/brackets
- [x] Status: Aberto → Em Andamento → Finalizado
- [x] Compartilhamento via link

### Partidas
- [x] Geração automática por formato
- [x] Registro de resultados (criador ou participante)
- [x] Avanço automático no mata-mata
- [x] Visualização de bracket interativo

### UI/UX
- [x] Design iOS moderno com tema escuro
- [x] Responsivo (mobile-first)
- [x] Animações suaves (Framer Motion)
- [x] Fonte Manrope
- [x] Filtros por jogo, status, gratuito/pago
- [x] Loading skeletons
- [x] Toast notifications

---

## API Endpoints

```
POST   /api/auth/register          Criar conta
POST   /api/auth/login             Login

GET    /api/users                  Listar usuários
GET    /api/users/me               Perfil do usuário logado
GET    /api/users/ranking          Ranking global
PUT    /api/users/me               Atualizar perfil
POST   /api/users/me/avatar        Upload de avatar

GET    /api/tournaments            Listar campeonatos (com filtros)
POST   /api/tournaments            Criar campeonato
GET    /api/tournaments/:id        Detalhes do campeonato
PUT    /api/tournaments/:id        Atualizar campeonato
DELETE /api/tournaments/:id        Excluir campeonato
POST   /api/tournaments/:id/join   Inscrever-se
DELETE /api/tournaments/:id/leave  Cancelar inscrição
POST   /api/tournaments/:id/generate-bracket  Gerar chaves

GET    /api/tournaments/:id/matches  Partidas do campeonato
POST   /api/matches/result           Registrar resultado

GET    /api/badges                  Listar badges
GET    /api/badges/me               Minhas badges
```

---

## ⚠️ Nota Importante sobre Estrutura de Rotas

O arquivo `frontend/src/app/(main)/page.tsx` deve ser **deletado** — ele entraria em conflito com `frontend/src/app/page.tsx` (ambos roteiam para `/`). O conteúdo da homepage está em `app/(main)/_HomePageContent.tsx` e é importado por `app/page.tsx`.

```bash
# Rode este comando antes de fazer build:
rm frontend/src/app/\(main\)/page.tsx
```

---

## Dados de Demonstração

Após o seed, use a conta demo:
- **E-mail:** `demo@liga7.gg`
- **Senha:** `demo123`
