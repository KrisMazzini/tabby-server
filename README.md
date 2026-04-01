# Tabby

**EN** — Tabby is an application for splitting expenses among groups and friends. This repository contains the **backend (REST API)** of the project.

**PT** — Tabby é um aplicativo para divisão de despesas entre grupos e amigos. Este repositório contém o **backend (API REST)** do projeto.

---

## Project status · Status do projeto

**EN** — In progress.

**PT** — Em desenvolvimento.

---

## Tech stack

**EN**

The backend is designed around **Domain-Driven Design (DDD)** and **Clean Architecture**: business rules and models live at the center, independent of frameworks and persistence mechanics, while HTTP, Prisma, and other adapters sit at the boundaries. Data access goes through **repository** abstractions so the domain does not depend on the database; **factories** assemble use cases with their concrete implementations and keep wiring in one place. **Automated tests** (Vitest) cover domain and application layers to lock in behavior as features grow.

| Layer | Technology |
|-------|------------|
| Runtime | [Node.js](https://nodejs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| HTTP | [Fastify](https://fastify.dev/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Tests | [Vitest](https://vitest.dev/) |
| Dev server | [tsx](https://github.com/privatenumber/tsx) |
| Local container | [Docker Compose](https://docs.docker.com/compose/) (Bitnami PostgreSQL) |

**PT**

O backend foi concebido com **Domain-Driven Design (DDD)** e **Clean Architecture**: regras e modelos de negócio ficam no centro, independentes de frameworks e de detalhes de persistência, enquanto HTTP, Prisma e outros adaptadores ficam nas bordas. O acesso a dados passa por abstrações de **repositório**, para o domínio não acoplar ao banco; **factories** montam os casos de uso com implementações concretas e concentram a composição. **Testes automatizados** (Vitest) cobrem domínio e aplicação para preservar o comportamento à medida que o produto evolui.

| Camada | Tecnologia |
|--------|------------|
| Runtime | [Node.js](https://nodejs.org/) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| HTTP | [Fastify](https://fastify.dev/) |
| Banco de dados | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Testes | [Vitest](https://vitest.dev/) |
| Lint / formatação | [Biome](https://biomejs.dev/) |
| Container local | [Docker Compose](https://docs.docker.com/compose/) (PostgreSQL Bitnami) |

---

## Features · Principais funcionalidades

### Product vision · Visão do produto

**EN**

- Organize shared expenses in groups and among friends.
- Track who owes whom and simplify settlements.

**PT**

- Organizar despesas compartilhadas em grupos e entre amigos.
- Acompanhar quem deve a quem e simplificar acertos.

---

## How to run · Como executar o projeto

### Prerequisites · Pré-requisitos

**EN**

- [Node.js](https://nodejs.org/) (recommended: current LTS)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) to run PostgreSQL locally

**PT**

- [Node.js](https://nodejs.org/) (recomendado: versão LTS atual)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) para subir o PostgreSQL localmente

### 1. Environment variables · Variáveis de ambiente

**EN** — Copy the example file and adjust if needed:

**PT** — Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

### 2. Database (PostgreSQL) · Banco de dados (PostgreSQL)

**EN** — From the repository root:

**PT** — Na raiz do repositório:

```bash
docker compose up -d
```

**EN** — This starts the `tabby-pg` service on port **5432**, matching the default example `DATABASE_URL`.

**PT** — Isso sobe o serviço `tabby-pg` na porta **5432**, alinhado ao `DATABASE_URL` padrão do exemplo.

### 3. Dependencies and Prisma · Dependências e Prisma

```bash
pnpm install
pnpm prisma:generate
```

### 4. Development server · Servidor em desenvolvimento

```bash
pnpm dev
```

**EN** — The API listens on `0.0.0.0` using the port from `PORT` (default **3333**).

**PT** — A API sobe no host `0.0.0.0` na porta definida em `PORT` (padrão **3333**).

### Useful commands · Comandos úteis

**EN**

| Command | Description |
|---------|-------------|
| `pnpm build` | Builds the bundle to `dist/` |
| `pnpm start` | Runs the build (`node dist/infra/server.cjs`) |
| `pnpm test` | Runs tests (Vitest) |

**PT**

| Comando | Descrição |
|---------|-----------|
| `pnpm build` | Gera o bundle em `dist/` |
| `pnpm start` | Executa a build (`node dist/infra/server.cjs`) |
| `pnpm test` | Roda os testes (Vitest) |

---

Kristopher Mazzini
