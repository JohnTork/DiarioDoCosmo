# Diário do Cosmo

Estrutura inicial de uma aplicação para a NASA Astronomy Picture of the Day
(APOD). Esta etapa configura o frontend e o backend, sem implementar ainda a
consulta à API ou outras funcionalidades da aplicação.

## Tecnologias

- Frontend: React, TypeScript e Vite.
- Backend: Node.js, TypeScript e Express.

## Pré-requisitos

- Node.js 20.19+ ou 22.12+.
- npm.

## Instalação

Instale as dependências em cada aplicação:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Executar em desenvolvimento

Abra um terminal para cada processo:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

O Vite informa no terminal o endereço local do frontend. O backend inicia na
porta `3001` (ou na porta indicada pela variável de ambiente `PORT`).

## Verificar a configuração

Compile e verifique os tipos nos dois projetos:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

## Estrutura

```text
backend/
  src/app.ts
  src/server.ts
frontend/
  src/App.tsx
  src/main.tsx
  src/styles.css
  index.html
```

O arquivo `backend/.env.example` ilustra a configuração futura da chave NASA.
Copie-o para `backend/.env` quando a integração for desenvolvida; arquivos
`.env` são ignorados pelo Git. Não coloque credenciais no frontend.