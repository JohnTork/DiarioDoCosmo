Instruções do GitHub Copilot — NASA APOD
1. Objetivo do projeto

Desenvolver uma aplicação web responsiva que apresente a Astronomy Picture of the Day (APOD), serviço de astronomia da NASA.

A aplicação deverá permitir que o usuário:

Visualize a imagem ou o vídeo astronômico do dia.
Consulte o título, a data e a explicação do conteúdo.
Escolha uma data específica para consultar outra publicação.
Visualize corretamente conteúdos do tipo imagem e vídeo.
Receba mensagens de carregamento e de erro.
Utilize a aplicação em computadores, tablets e celulares.

A aplicação deverá consumir a API:

GET https://api.nasa.gov/planetary/apod

2. Tecnologias utilizadas
Tecnologias obrigatórias
React: desenvolver os componentes e a interface do usuário.
TypeScript: implementar tipagem estática e reduzir erros.
Vite: configurar e executar o ambiente de desenvolvimento frontend.
Node.js: executar o servidor backend.
Express: disponibilizar endpoints para comunicação entre frontend e backend.
CSS3: implementar o layout, as cores, as animações e a responsividade.
Fetch API: realizar requisições HTTP no frontend e no backend.
NASA APOD API: fornecer os dados astronômicos.
Tecnologias permitidas
Lucide React para ícones.
Dotenv para gerenciamento de variáveis de ambiente.
Nodemon para reiniciar o servidor durante o desenvolvimento.
Vitest e Supertest para testes automatizados.
Tecnologias não permitidas
Não utilizar jQuery.
Não utilizar Bootstrap.
Não utilizar Tailwind CSS.
Não utilizar bibliotecas prontas de componentes de interface.
Não realizar chamadas diretamente à NASA pelo frontend.
Não armazenar a chave da NASA no código-fonte do React.

Utilizar apenas dependências necessárias para manter o projeto simples e organizado.

3. Arquitetura do sistema

O projeto deverá ser dividido em frontend e backend.

Estrutura de diretórios

Manter a seguinte organização:

text
nasa-apod/
│
├── .github/
│   └── copilot-instructions.md
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── apodController.ts
│   │   ├── services/
│   │   │   └── nasaService.ts
│   │   ├── routes/
│   │   │   └── apodRoutes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ApodCard.tsx
│   │   │   ├── DateSelector.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── services/
│   │   │   └── apodService.ts
│   │   ├── types/
│   │   │   └── Apod.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
├── .gitignore
├── .env
├── .env.example
└── README.md

Responsabilidades do backend

nasaService.ts

Realizar a comunicação com a API oficial da NASA.
Enviar a chave de autenticação armazenada no servidor.
Receber e normalizar os dados da NASA.
Tratar erros de comunicação e respostas inválidas.
Aplicar timeout nas requisições externas.

apodController.ts

Receber a data solicitada pelo frontend.
Validar o formato e os limites da data.
Solicitar os dados ao serviço nasaService.
Retornar os dados em formato JSON.
Retornar códigos HTTP apropriados em caso de erro.

apodRoutes.ts

Disponibilizar a rota GET /api/apod.
Permitir o recebimento do parâmetro opcional date.

server.ts

Inicializar o servidor Express.
Carregar as variáveis de ambiente.
Configurar a porta de execução.

O frontend deverá acessar somente o backend, nunca diretamente a API da NASA.

Responsabilidades do frontend

Header.tsx

Exibir o nome da aplicação.
Apresentar a identidade visual relacionada à astronomia.

DateSelector.tsx

Disponibilizar um campo de seleção de data.
Permitir consultar publicações de outras datas.
Impedir a seleção de datas futuras.

ApodCard.tsx

Exibir título, data e explicação.
Identificar o tipo de mídia recebido.
Apresentar imagens usando a URL fornecida pela API.
Apresentar vídeos em um iframe responsivo.
Não renderizar imagens quando o conteúdo for um vídeo.

Loading.tsx

Apresentar um indicador visual durante o carregamento.

ErrorMessage.tsx

Informar erros de comunicação ou indisponibilidade.
Disponibilizar uma opção para tentar novamente.

apodService.ts

Consultar o endpoint /api/apod.
Enviar a data selecionada.
Tratar respostas HTTP inválidas.

Apod.ts

Definir as interfaces TypeScript dos dados recebidos.
Tipar os campos de data, título, explicação, mídia e URLs.
4. Integração com a NASA APOD API

O endpoint solicitado é:

https://api.nasa.gov/planetary/apod

Método HTTP:

GET

Parâmetros relevantes:

api_key: chave de autenticação da NASA.
date: data da publicação no formato YYYY-MM-DD.
start_date: início de um intervalo de datas.
end_date: fim de um intervalo de datas.
count: quantidade de imagens aleatórias, com limite de 25.

Para esta aplicação, utilizar somente api_key e date.

A data deverá respeitar o período disponível na API, a partir de 1995-06-16, sem permitir datas futuras.

Campos da resposta

Considerar os seguintes campos do formato APOD tradicional:

date: data da publicação.
title: título do conteúdo.
explanation: explicação astronômica.
media_type: tipo de mídia, como image ou video.
url: endereço da mídia.
hdurl: endereço da imagem em alta resolução, quando disponível.
copyright: créditos da imagem, quando disponíveis.

A integração deverá utilizar um adaptador no backend para normalizar a resposta recebida. Não presumir que todos os campos são obrigatórios ou que estarão presentes em todas as publicações.

A NASA anunciou uma atualização da APOD API em setembro de 2026 e a desativação do endpoint legado para dezembro de 2026. Portanto, manter a comunicação externa isolada em nasaService.ts, facilitando a adaptação ao novo formato de resposta e ao novo endpoint oficial.

Documentação: https://api.nasa.gov/

Repositório oficial: https://github.com/nasa/apod-api

5. Estilização do frontend

Criar uma interface moderna, minimalista e inspirada no espaço.

Identidade visual
Fundo principal em azul-marinho muito escuro ou preto.
Textos principais em branco.
Textos secundários em cinza-claro.
Cor de destaque em azul ou roxo.
Elementos com bordas discretas e cantos arredondados.
Sombras suaves para destacar os conteúdos.
Organização visual

A página deverá conter:

Cabeçalho com nome e identificação da NASA APOD.
Título principal destacando a imagem astronômica do dia.
Campo de seleção de data.
Área principal para apresentação da imagem ou vídeo.
Título e data da publicação.
Seção com a explicação astronômica.
Créditos da imagem, quando disponíveis.
Responsividade
Utilizar CSS Grid ou Flexbox.
Implementar abordagem mobile-first.
Evitar rolagem horizontal.
Utilizar imagens com max-width: 100%.
Manter vídeos em contêineres com proporção adequada.
Garantir boa legibilidade em telas pequenas.
Adaptar espaçamentos, fontes e componentes conforme a largura da tela.
Acessibilidade
Utilizar HTML semântico.
Incluir textos alternativos nas imagens.
Garantir contraste adequado.
Utilizar labels nos campos de formulário.
Garantir navegação por teclado.
Apresentar mensagens de erro acessíveis.
6. Segurança

A segurança da chave da NASA é obrigatória.

Proteção da chave
Armazenar a chave exclusivamente no arquivo .env da raiz do projeto.
Utilizar a variável NASA_API_KEY.
Nunca escrever a chave diretamente no código.
Nunca enviar a chave ao frontend.
Nunca utilizar variáveis VITE_ para armazenar a chave.
Incluir arquivos .env no .gitignore.
Disponibilizar somente um .env.example sem credenciais reais.
Não registrar a chave em logs ou mensagens de erro.
Proteção das requisições
Validar a data recebida pelo backend.
Aceitar somente datas válidas no formato YYYY-MM-DD.
Impedir datas anteriores a 1995-06-16.
Impedir datas futuras.
Utilizar timeout nas chamadas externas.
Tratar erros sem expor informações internas do servidor.
Não permitir que o usuário informe URLs arbitrárias para o backend acessar.
Proteção de vídeos
Aceitar somente URLs HTTPS.
Não inserir conteúdo externo por meio de HTML não confiável.
Utilizar iframe com atributos de segurança e permissões apropriadas.
Não utilizar dangerouslySetInnerHTML para renderizar conteúdo da NASA.
Repositório
Não versionar o arquivo .env.
Não versionar credenciais.
Não colocar chaves ou tokens em arquivos públicos.
Conferir o conteúdo dos commits antes de enviá-los ao GitHub.

Em produção, configurar a variável de ambiente diretamente na plataforma de hospedagem.

7. Estados da aplicação

A aplicação deverá implementar os seguintes estados:

Carregamento
Mostrar um indicador enquanto os dados são consultados.
Evitar que o usuário interprete uma consulta em andamento como falha.
Sucesso
Apresentar o título, a data, a mídia e a explicação.
Exibir imagens e vídeos de acordo com media_type.
Erro
Mostrar uma mensagem compreensível.
Não apresentar erros técnicos diretamente ao usuário.
Permitir realizar uma nova tentativa.
Mudança de data
Consultar novamente a API quando o usuário escolher outra data.
Atualizar o conteúdo apresentado.
Evitar respostas antigas substituírem resultados de consultas mais recentes.
8. Regras de desenvolvimento

O GitHub Copilot deverá seguir estas regras:

Desenvolver uma etapa por vez.
Não criar todo o projeto de uma única vez.
Respeitar rigorosamente a arquitetura definida.
Não adicionar bibliotecas sem necessidade.
Não modificar arquivos não relacionados à tarefa atual.
Utilizar TypeScript em todos os arquivos de código aplicáveis.
Manter os componentes pequenos e reutilizáveis.
Utilizar nomes descritivos para funções e variáveis.
Tratar erros nas operações assíncronas.
Comentar somente trechos que realmente necessitem de explicação.
Explicar brevemente as alterações realizadas ao concluir cada etapa.
Informar quais testes devem ser executados após cada alteração.

Se uma instrução não puder ser seguida, explicar o motivo antes de propor uma alternativa.

9. Critérios de aceitação

O projeto somente será considerado concluído quando:

A aplicação carregar o APOD do dia.
O título for exibido corretamente.
A data for exibida corretamente.
A explicação astronômica for exibida.
Imagens forem apresentadas corretamente.
Vídeos forem apresentados corretamente.
O usuário puder selecionar outra data.
Datas inválidas e futuras forem rejeitadas.
Houver indicador de carregamento.
Houver tratamento de erros.
A interface funcionar em celulares e computadores.
A chave da NASA permanecer exclusivamente no backend.
O arquivo .env não estiver no repositório.
O README explicar como instalar e executar o projeto.
10. Documentação

Inserir no README.md:

Descrição do projeto.
Tecnologias utilizadas.
Pré-requisitos.
Instruções de instalação.
Configuração da chave da NASA.
Instruções para executar frontend e backend.
Funcionalidades disponíveis.
Estrutura de diretórios.
Observações sobre a API utilizada.

O README deverá ser escrito em português brasileiro.

Regra final: priorizar código simples, organizado, seguro, funcional e de fácil compreensão para fins educacionais.