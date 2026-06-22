# CleanLine

Sistema fullstack de gestão de limpeza e vistorias, com cadastro de equipes, funcionários, setores, rotas e checklists de inspeção, dashboard com indicadores e notificações em tempo real via WebSockets.

## Stack

**Backend**
- Node.js + Express
- Prisma ORM + PostgreSQL (Neon)
- Socket.IO (eventos em tempo real)
- JWT (cookies HttpOnly) para autenticação
- Cloudinary (upload de imagens)
- express-rate-limit (proteção de rotas de login)

**Frontend**
- Next.js 16 + React 19
- Tailwind CSS v4
- Radix UI / shadcn
- Recharts (gráficos do dashboard)
- Socket.IO Client

**Deploy**
- Frontend: Vercel
- Backend: Render

## Estrutura do projeto

```
CleanLine/
├── backend/
│   ├── prisma/              # schema.prisma e migrations
│   ├── src/
│   │   ├── config/          # configuração do Cloudinary
│   │   ├── controllers/     # lógica de negócio das rotas
│   │   ├── db/               # conexão com o banco
│   │   ├── middlewares/     # auth, rate limit, upload
│   │   ├── routes/           # definição das rotas da API
│   │   ├── server.js         # entrypoint do Express
│   │   └── socket.js         # configuração do Socket.IO
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/               # rotas/páginas (App Router)
    │   ├── components/        # componentes de UI por módulo
    │   ├── hooks/
    │   └── lib/                # api.js, authSession.js, utils
    └── package.json
```

## Funcionalidades

- Autenticação de Administradores e Supervisores com JWT em cookies `HttpOnly`
- Cadastro e gestão de equipes de limpeza, funcionários, setores e rotas
- Checklists de vistoria com pontuação qualitativa (q1-q8) e upload de foto
- Dashboard com indicadores e gráficos de desempenho
- Atualizações em tempo real via WebSockets
- Rate limiting em rotas sensíveis (login/autenticação)

## Pré-requisitos

- Node.js 18+
- Banco de dados PostgreSQL (recomendado: [Neon](https://neon.tech))
- Conta no [Cloudinary](https://cloudinary.com) (para upload de imagens)

## Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/SGZ777/CleanLine.git
cd CleanLine
```

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Banco de dados (Prisma)
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"

# Autenticação
JWT_SECRET="uma_chave_secreta_forte"

# Servidor
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Rate limiting (opcional - valores padrão já definidos no código)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=600000
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

Rode as migrations do Prisma:

```bash
npx prisma migrate deploy
# ou, em desenvolvimento:
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

O backend roda por padrão em `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env.local` na pasta `frontend/` com:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend roda por padrão em `http://localhost:3000`.

## Scripts

**Backend**

| Comando         | Descrição                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Inicia o servidor com nodemon (hot reload) |
| `npm start`     | Inicia o servidor em modo produção         |

**Frontend**

| Comando         | Descrição                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Inicia o Next.js em modo desenvolvimento  |
| `npm run build` | Gera o build de produção                  |
| `npm start`     | Inicia o servidor Next.js em produção      |

## Modelo de dados (resumo)

O schema Prisma (`backend/prisma/schema.prisma`) define as seguintes entidades principais:

- **ADM**: administradores do sistema
- **Supervisor**: responsáveis por realizar vistorias
- **Equipe_Limpeza**: equipes de limpeza, associadas a funcionários e setores
- **Func_Limpeza**: funcionários de limpeza
- **Rota**: rotas de inspeção, associadas a setores via `SetorRota`
- **Setor**: setores/áreas a serem limpas e vistoriadas
- **Vistoria**: registros de inspeção com pontuação qualitativa (q1-q8), imagem e nota final

## Segurança

- Senhas armazenadas com hash (`bcryptjs`)
- Tokens JWT entregues via cookies `HttpOnly` e `SameSite=None; Secure` (necessário para uso cross-origin entre Vercel e Render)
- Middlewares de autenticação e autorização (`authMiddleware`, `adminMiddleware`) protegendo rotas administrativas
- Rate limiting dedicado para rotas de login/autenticação

## Licença

Projeto pessoal/educacional. Defina a licença de sua preferência.
