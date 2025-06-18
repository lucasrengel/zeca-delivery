# Zeca Delivery Painel

## Introdução

Zeca Delivery Painel é uma aplicação web para gerenciar pedidos e entregadores de um serviço de delivery. Este painel oferece uma interface intuitiva com dashboards para monitorar estatísticas como pedidos do dia, faturamento, tempo médio de entrega e status dos entregadores. Desenvolvido com React no frontend e Express.js no backend, utiliza um banco de dados MySQL para armazenar informações.

## Requisitos

- Node.js instalado (versão 18 ou superior recomendada)
- MySQL instalado e rodando

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasrengel/zeca-delivery
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:

   - Crie um banco no MySQL com o nome desejado.
   - Cole o script SQL fornecido na raiz do projeto ou na pasta `database/` no seu MySQL para criar as tabelas necessárias.
   - Atualize as configurações de conexão com o banco no arquivo `.env` ou `config.js` (dependendo do projeto).

4. Inicie o servidor e o frontend:
   ```bash
   npm run dev
   ```

Isso iniciará o projeto em modo de desenvolvimento. Acesse `http://localhost:3000` para visualizar o painel.
