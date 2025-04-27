<div align="center">
  <img src="./.github_assets/cover2.png">
  <div align="center">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">
    <img src="https://img.shields.io/badge/Github%20Actions-282a2e?style=for-the-badge&logo=githubactions&logoColor=367cfe">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  </div>
</div>

<br>
<br>

# 🛒 Shopping List

Uma aplicação prática para ajudar você a não esquecer itens de compra e evitar surpresas no valor total.

## 📃 Descrição

**Shopping List** é uma aplicação fullstack que permite aos usuários gerenciar suas compras em supermercados e outros estabelecimentos. Suas listas ficam salvas e podem ser acessadas e editadas a qualquer momento

Clique [aqui](https://shopping-list-eta-ten.vercel.app/login) para acessar a aplicação.

Caso queira testar sem criar uma conta, utilize:

- **email**: testuser@email.com

- **senha**: T4stusr!6

### 📱 Versão para celular

<div align="center">
  <img src="./.github_assets/login_mobile.png" width="30%" style="margin: 10px;">
  <img src="./.github_assets/home_mobile.png" width="30%" style="margin: 10px;">
  <img src="./.github_assets/home_mobile_white.png" width="30%" style="margin: 10px;">
</div>

### 💻 Versão para computador

<div align="center">
  <img src="./.github_assets/login_desk.png" width="45%" style="margin: 10px;">
  <img src="./.github_assets/home_desk.png" width="45%" style="margin: 10px;">
</div>

## 🔨 Tecnologias e ferramentas

- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Jest
- Husky
- GitHub Actions

## ✨ Funcionalidades

- Cadastro e login de usuários
- Recuperação de senha por email
- Listagem e filtragem de produtos
- Temas light e dark
- Temas claro e escuro (com detecção automática baseada no dispositivo)

## 📦 Como instalar a aplicação

1. Faça o clone desta aplicação em um diretório de sua preferência

```bash
git clone https://github.com/DaniloMelo/shopping-list.git
```

2. Dentro do diretório da aplicação, instale as dependências com o comando:

```bash
npm install
```

3. Configure as variáveis de ambiente.

Crie o arquivo `.env.development` com os seguintes valores:

- **DATABASE_URL**="postgresql://local_user:local_password@localhost:5432/local_db?schema=public?"
- **POSTGRES_HOST**=localhost
- **POSTGRES_PORT**=5432
- **POSTGRES_DB**=local_db
- **POSTGRES_USER**=local_user
- **POSTGRES_PASSWORD**=local_password
- **JWT_SECRET**="local_secret_key"

Crie também um arquivo `.env` com os seguintes valores:

- **DATABASE_URL**="postgresql://local_user:local_password@localhost:5432/local_db?schema=public?"
- **EMAIL_HOST**=smtp.gmail.com
- **EMAIL_PORT**=587
- **EMAIL_USER**=seu_email
- **EMAIL_PASSWORD**=sua_senha_de_app

  **Importante**: As variáveis de ambiente **EMAIL_USER**, **EMAIL_PASSWORD** são necessárias para que o serviço de recuperação de senha funcione corretamente. Para isso, é necessário um email real. Se for Gmail, configure uma **senha de app** em sua conta. [Saiba mais sobre como gerar uma senha de app no Gmail](https://www.youtube.com/watch?v=nFbZLX2U-5k)

## 🖥️ Como rodar a aplicação

1. Inicie o banco de dados com Docker:

```bash
npm run services:up
```

2. Sincronize as migrations, rode o seed e inicie o servidor:

```bash
npm run dev
```

Acesse a aplicação em **http://localhost:3000/**

## ✅ Testes Automatizados

Este projeto utiliza Jest para testes unitários e de integração.

Além disso, utiliza Husky para validar testes localmente antes dos commits e GitHub Actions para rodar testes em pushs e pull requests.

Para rodar testes localmente:

```bash
npm run test
```

Para rodar os testes em modo **watch**:

```bash
npm run test:watch
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📝 Licença

Este projeto está sob a licença MIT.
