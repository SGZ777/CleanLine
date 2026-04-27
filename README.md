# CleanLine

Projeto separado em **frontend** (Next.js) e **backend** (Express.js).

```
CleanLine/
├── frontend/   → Next.js (páginas, componentes, UI)
└── backend/    → Express.js (API REST, banco de dados)
```

---

## 🚀 Como rodar

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # preencha com suas credenciais
npm run dev            # porta 3001
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # defina NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev                  # porta 3000
```

---

## ⚙️ Variáveis de ambiente

### backend/.env
| Variável        | Descrição                        |
|-----------------|----------------------------------|
| `DB_HOST`       | Host do banco MySQL              |
| `DB_USER`       | Usuário do banco                 |
| `DB_PASSWORD`   | Senha do banco                   |
| `DB_NAME`       | Nome do banco                    |
| `DB_PORT`       | Porta do banco (padrão: 3306)    |
| `JWT_SECRET`    | Chave secreta para tokens JWT    |
| `PORT`          | Porta do servidor (padrão: 3001) |
| `FRONTEND_URL`  | URL do frontend para CORS        |

### frontend/.env.local
| Variável               | Descrição                   |
|------------------------|-----------------------------|
| `NEXT_PUBLIC_API_URL`  | URL base do backend Express |

---

## 📡 Rotas da API (Backend)

| Método | Rota                                    | Descrição                        |
|--------|-----------------------------------------|----------------------------------|
| POST   | `/api/auth`                             | Login (retorna JWT)              |
| GET    | `/api/user`                             | Dados do usuário logado          |
| GET    | `/api/funcionarios`                     | Listar funcionários              |
| POST   | `/api/funcionarios`                     | Criar funcionário                |
| PUT    | `/api/funcionarios/:id`                 | Atualizar funcionário            |
| PATCH  | `/api/funcionarios/:id?tipo=`           | Inativar funcionário             |
| GET    | `/api/setores`                          | Listar setores                   |
| POST   | `/api/setores`                          | Criar setor                      |
| PUT    | `/api/setores/:id`                      | Atualizar setor                  |
| PATCH  | `/api/setores/:id`                      | Excluir setor                    |
| GET    | `/api/rotas`                            | Listar rotas                     |
| POST   | `/api/rotas`                            | Criar rota                       |
| PUT    | `/api/rotas/:id`                        | Atualizar rota                   |
| PATCH  | `/api/rotas/:id`                        | Excluir rota                     |
| GET    | `/api/dashboard/media-mensal`           | Média mensal de pontuação        |
| GET    | `/api/dashboard/maior-nota-dia`         | Maior nota do dia                |
| GET    | `/api/dashboard/grafico-pontuacao-mensal` | Dados do gráfico mensal        |
| GET    | `/api/dashboard/ranking-mes`            | Ranking do mês                   |
| GET    | `/api/inspecoes`                        | Listar inspeções                 |
| POST   | `/api/inspecoes`                        | Criar inspeção                   |
| GET    | `/health`                               | Health check do servidor         |
