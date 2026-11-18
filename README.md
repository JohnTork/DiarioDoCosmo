# Diário do Cosmo

Aplicação para explorar a NASA Astronomy Picture of the Day (APOD), com uma
interface React responsiva e um backend que consulta a API da NASA sem expor a
chave de autenticação ao navegador.

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

Crie `.env` na raiz do projeto a partir de `.env.example` e preencha
`NASA_API_KEY` com sua chave da NASA. Não versione o arquivo `.env`.

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
porta `3001` (ou na porta indicada pela variável de ambiente `PORT`). Se usar
uma porta diferente, configure `BACKEND_URL` ao iniciar o Vite, apontando para
o backend, por exemplo `http://localhost:4000`.

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
  src/components/
    Header.tsx
    ApodCard.tsx
    DateSelector.tsx
    Loading.tsx
    ErrorMessage.tsx
  src/services/apodService.ts
  src/types/Apod.ts
  src/App.tsx
  src/main.tsx
  src/styles.css
  index.html
```

Configure a variável `NASA_API_KEY` no arquivo `.env` da raiz; arquivos `.env`
são ignorados pelo Git. Não coloque credenciais no frontend.

## Endpoint APOD do backend

O backend disponibiliza `GET http://localhost:3001/api/apod`. O parâmetro
`date` é opcional e deve usar o formato `YYYY-MM-DD`, entre `1995-06-16` e a
data atual no fuso horário de Nova York, alinhado ao calendário da publicação
da NASA. A comunicação é feita pelo endpoint APOD atual da NASA Science
(`https://science.nasa.gov/wp-json/wp/v2/apod-basic/`); o backend adapta sua
resposta em lista para um objeto consistente e usa o endereço da imagem em
alta resolução quando a API apresenta uma página de artigo no campo `url`.
Descrições e créditos são convertidos em texto antes de serem enviados ao
frontend. Para uma data selecionada, o backend usa o formato `YYMMDD` no
caminho da API (por exemplo, `2026-11-13` vira `261113`), pois o endpoint
ignora o parâmetro `date` na query string. Sem o parâmetro, a consulta solicita
a publicação mais recente.

Configure `NASA_API_KEY` no `.env` da raiz; a chave é usada somente no servidor
e não é enviada ao frontend. O backend valida a data e aplica timeout na
requisição à NASA.

Exemplos de teste:

```powershell
Invoke-RestMethod http://localhost:3001/api/apod
Invoke-RestMethod "http://localhost:3001/api/apod?date=2024-01-01"
```

Uma data inválida ou futura retorna HTTP 400. Erros da NASA são respondidos
com uma mensagem segura, sem detalhes internos nem credenciais.

Os testes do backend podem ser executados com:

```powershell
cd backend
npm test
```

## Funcionalidades disponíveis

- Carrega o conteúdo APOD para a data atual e permite escolher outra data
  no formato dia/mês/ano, desde 16/06/1995.
- Apresenta título, data, explicação, créditos e a imagem ou o vídeo.
- Exibe estados de carregamento e erro, com opção para tentar novamente.
- Cancela a consulta anterior quando a data muda, evitando que respostas
  antigas substituam o resultado mais recente.

O frontend usa somente `/api/apod`. No desenvolvimento, o Vite encaminha essa
rota ao backend na porta `3001`; ele não chama a API da NASA diretamente.