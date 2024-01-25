
# Sistema de gerenciamento de clientes

Este projeto contitui-se de um gerenciamento básico de clientes para uma empresa de logística. Conta com front-end em React, backend em Node.js e utiliza banco de dados PostgreSQL com Docker

Antes de começar, certifique-se de ter instalado:

- Docker e Docker Compose
- Node.js (versão utilizada: v16.x.x)
- npm (versão utilizada: v8.x.x)

## Configuração do Ambiente

### Banco de Dados
Na raiz do projeto, execute o seguinte comando para iniciar o banco de dados com Docker:

```bash
   docker-compose up
```
- Conecte-se ao banco de dados no endereço 0.0.0.0:5438. As credenciais estão disponíveis no arquivo Dockerfile
- Crie a tabela executando o script SQL localizado em `database/DDL/clientes.sql`
- (Opcional) Para popular a tabela, execute o script em `database/DML/clientes.sql`

## API

Navegue até a pasta `server` do projeto

Instale as dependências com:

```bash
   npm install
```

Execute o comando abaixo para iniciar a API:

```bash
   npm start
```
Para executar a API em modo hot reload execute o comando abaixo:

```bash
   npm run dev
```

A API estará rodando na porta `3004`

Obs: caso mude a porta, certifique-se de mudar também no front-end

## Front-end

Navegue até a pasta `client` do projeto

Instale as dependências com:

```bash
   npm install
```

Inicie o front-end com::

```bash
   npm start
```

O front-end estará disponível em localhost:3000

## Executando os Testes

### Front-end

Navegue até a pasta `client`

Certifique-se de estar com o front rodando

Execute
```bash
   npm test
```

Após o Cypress abrir: 

- Clique na opção E2E Testing
- Selecione o navegador desejado
- Clique no teste para rodá-lo

### Back-end

Execute o comando abaixo:

```bash
   npm test
```

## Tecnologias Utilizadas

- Docker e Docker Compose
- Node.js (Back-end)
- React (Front-end)
- PostgreSQL (Banco de Dados)
- Express.js (Framework para Node.js)
- Material-UI (Interface do Usuário)
- Mocha (Framework de Testes para Back-end)
- Chai (Biblioteca de Asserções para Testes)
- Sinon (Biblioteca de Mocks e Stubs para Testes)
- Supertest (Biblioteca para Testar APIs HTTP)
- Cypress (Testes E2E)


## Autor

Rhuan Souza