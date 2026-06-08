# Conteiners

Monorepo com API Django REST Framework (JWT + PostgreSQL) e frontend React/TypeScript.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (apenas se rodar o frontend fora do Docker)

## Configuração

```bash
cp .env.example .env
```

## Desenvolvimento

### Dev Container (recomendado)

1. Abra o projeto no Cursor/VS Code
2. Execute **Dev Containers: Reopen in Container**
3. Aguarde o build dos containers

Serviços disponíveis:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

### Docker Compose (dev)

```bash
docker compose up -d --build
```

Equivalente a:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### Frontend fora do Docker (opcional)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Produção

```bash
cp .env.prod.example .env.prod
# Edite DJANGO_SECRET_KEY, POSTGRES_PASSWORD e DJANGO_ALLOWED_HOSTS
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

A aplicação ficará disponível em `http://localhost` (Nginx serve o frontend e faz proxy de `/api` para o Django/Gunicorn).

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register/` | Cadastro (name, email, password) |
| POST | `/api/auth/token/` | Login (email, password) → tokens JWT |
| POST | `/api/auth/token/refresh/` | Renovar access token |
| GET | `/api/users/me/` | Perfil autenticado |

## Qualidade (backend)

```bash
cd backend
pip install -r requirements-dev.txt
ruff check .
ruff format --check .
mypy .
pytest
lint-imports --config importlinter.ini
```

## CI/CD e SonarCloud

O desenvolvimento acontece na branch `dev`. O pipeline GitHub Actions (`.github/workflows/ci.yml`) roda automaticamente em push na `dev` e em pull requests.

Quando todos os testes passam em `dev`, o job `promote` faz merge automático para `main`.

### Fluxo de branches

```bash
git checkout dev          # trabalhar sempre na dev
git add . && git commit -m "sua mensagem"
git push origin dev       # CI roda e, se passar, promove para main
```

### Jobs do pipeline

| Job | Análises |
|-----|----------|
| `backend` | Ruff, mypy, pytest (com cobertura), import-linter |
| `frontend` | ESLint, build TypeScript |
| `sonarcloud` | Envio dos resultados ao SonarCloud |
| `promote` | Merge automático `dev` → `main` (apenas em push na `dev`) |

### Configuração do SonarCloud

1. Crie uma conta em [sonarcloud.io](https://sonarcloud.io)
2. Crie uma organização e importe o repositório GitHub
3. Gere um token em **My Account > Security**
4. No GitHub, configure:
   - Secret `SONAR_TOKEN` com o token gerado
   - Variable `SONAR_ORGANIZATION` com o slug da organização no SonarCloud
5. Opcional: ative o **Quality Gate** no SonarCloud para bloquear merges com problemas

### Testar localmente

```bash
cd backend
pip install -r requirements-dev.txt
ruff check . && ruff format --check . && mypy .
pytest --cov=. --cov-report=xml
lint-imports --config importlinter.ini

cd ../frontend
npm ci && npm run lint && npm run build
```

## Estrutura

```
conteiners/
├── .devcontainer/           # Dev Containers (Cursor/VS Code)
├── .github/workflows/       # CI/CD (GitHub Actions)
├── backend/                 # Django REST Framework
├── frontend/                # React + TypeScript + Tailwind
├── docker-compose.yml       # Atalho para desenvolvimento
├── docker-compose.dev.yml   # Stack de desenvolvimento
├── docker-compose.prod.yml  # Stack de produção
└── sonar-project.properties # Configuração SonarCloud
```
