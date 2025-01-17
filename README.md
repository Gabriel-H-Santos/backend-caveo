# Backend CAVEO

Este microsserviço foi desenvolvido em NodeJS e [KoaJS](https://koajs.com/) como framework. 
Seu objetivo é simular a criação de usuários com a camada de autenticação via JWT token utilizando [AWS Cognito](https://aws.amazon.com/pt/pm/cognito/).
Utilizei as operações básicas de inserção, busca e atualização do usuário com base em sua *role*.
A seguir, darei o passo a passo de como clonar o repositório, intalar as dependências e rodar o projeto localmente.

## 🚀 Começando

Antes de tudo, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/).
Além disto, é imprescindível ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).
Optei pelo uso do [PostgreSQL](https://www.postgresql.org/) como banco relacional, então caso não tenha o mesmo instalado,
será necessário que utilize o [Docker](https://www.docker.com/products/docker-desktop/) ok?

### 📋 Pré-requisitos

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/) ({ node: 18.20.5, npm: 10.9.2 })
- [TypeScript](https://www.typescriptlang.org/) ({ tsc: 5.7.3 })

### 🔧 Instalação

```bash
# Clone este repositório
$ git clone https://github.com/Gabriel-H-Santos/backend-caveo.git

# Acesse a pasta do projeto no terminal
$ cd backend-caveo

# Instale as dependências
$ npm ci
```
Obs: utilize *npm ci* pois irá utilizar as versões com base no package-lock.json.

### 📦 Variáveis de ambiente
No projeto existem dois arquivos, *.env.development* e *.env.test*.
As variáveis devem ser inseridas para que a aplicação funcione corretamente.
Obs: Caso não possua as variáveis referente ao AWS Cognito, utilizei uma forma secundária de geração e decodificação dos tokens, ok?

### 🎲 Banco de dados (servidor)

Caso utilize o PostgreSQL na própria máquina, sem necessidade do docker, basta executar os seguintes comandos:

```bash
# Execute as migrations
$ npm run migration:run
```
Isso fará com que a tabela *users* seja criada no banco de dados.

```bash
# Popule a tabela users
$ npm run seed:run
```
Com isso, serão criados dois registros na tabela users.

### 🐋 Container

Se a opção for o uso do Docker, existe na raiz do projeto um arquivo docker-compose.yml,
que irá instalar o PostgreSQL em um conteiner.
Para isso, basta rodar esse comando:

```bash
# Subir o container Docker
$ npm run infra:up
```
Obs: ao subir a infra, o processo de migration e seed ocorrerá automaticamente.

Para derrubar o container e os volumes gerados, basta executar o seguinte comando:

```bash
# Remover o container Docker e volumes
$ npm run infra:down
```

# Execute a aplicação
```bash
$ npm start
```
O servidor inciará na porta:3000 (ou a porta que foi definida no arquivo .env.development).

### ⚙️ Executando os testes

Para rodar os testes, basta utilizar este comando via terminal/cmd:

```bash
# Irá rodar os testes de integração e unitários
$ npm t

# Irá rodar apenas os testes de integração
$ npm run test:integration

# Irá rodar apenas os testes unitários
$ npm run test:unit
```
Caso queira um registro com o coverage:

```bash
# Irá rodar os testes e gerar a % de cobertura
$ npm run test:cov
```

### 📄 Documentação

Um arquivo com extensão .json se encontra na pasta:
```src/shared/docs```

O mesmo pode ser importado dentro do [Postman](https://www.postman.com/), para facilitar o acesso aos endpoints.

A documentação com o swagger, pode ser acessada pela url [/doc](http://localhost:3000/doc/) com o servidor em execução.
