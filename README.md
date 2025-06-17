# Zeca Delivery Painel

Zeca Delivery Painel é uma aplicação web projetada para gerenciar operações de entrega de um negócio. Ele oferece um painel de controle amigável para monitorar métricas importantes, gerenciar pedidos, rastrear entregadores e ajustar configurações da aplicação, como o modo de tema (claro/escuro).

## Funcionalidades

- **Dashboard**: Exibe estatísticas importantes, incluindo pedidos de hoje, receita total, tempo médio de entrega e o número de entregadores. Também inclui gráficos para tempo de entrega, taxa de entrega, pedidos por dia e receita por dia.
- **Pedidos**: Lista todos os pedidos com detalhes como ID do pedido, nome do cliente, status, valor e informações adicionais.
- **Entregadores**: Mostra uma lista de entregadores com seu status, informações de contato e notas adicionais.
- **Opções**: Permite que os usuários alternem entre os temas claro e escuro para a interface da aplicação.
- **API Backend**: Fornece endpoints para buscar dados dinamicamente de um banco de dados MySQL, garantindo atualizações em tempo real no painel e nas listas.

## Pilha de Tecnologia

- **Frontend**: Construído com React.js usando `react-scripts` para processos de desenvolvimento e build, estilizado com Tailwind CSS e inclui Chart.js para visualização de dados.
- **Backend**: Desenvolvido com Node.js e Express.js, conectando-se a um banco de dados MySQL para armazenamento e recuperação de dados.
- **Banco de Dados**: MySQL, com um esquema definido para pedidos (`pedidos`) e entregadores (`entregadores`).

## Instruções de Configuração

Para configurar e executar a aplicação Zeca Delivery Painel localmente, siga estas etapas:

1. **Clonar o Repositório**: Baixe ou clone os arquivos do projeto para sua máquina local.
2. **Instalar Dependências**: Abra um terminal no diretório do projeto e execute:
   ```
   npm install
   ```
   Isso instalará todas as dependências necessárias listadas em `package.json`.
3. **Configuração do Banco de Dados**: Certifique-se de que o MySQL está instalado no seu sistema. Em seguida, execute o script de configuração do banco de dados para criar o banco de dados e as tabelas necessárias:
   ```
   npm run setup
   ```
   Este comando executa `run_setup_database.bat`, que configura o banco de dados usando o script definido em `setup_database.sql`. Pode ser necessário ajustar as credenciais do MySQL em `run_setup_database.bat` se elas diferirem do padrão (`root` com senha `12345`).
4. **Iniciar a Aplicação**: Uma vez que o banco de dados esteja configurado, inicie ambos os servidores backend e frontend com:
   ```
   npm run dev
   ```
   Este comando usa `concurrently` para executar o servidor backend (`node server.js`) na porta 3001 e o servidor de desenvolvimento frontend (`react-scripts start`) na porta 3000.
5. **Acessar a Aplicação**: Abra um navegador web e navegue para `http://localhost:3000` para visualizar o Zeca Delivery Painel.

**Configuração e Início Completo Alternativo**:
Se preferir executar a configuração e iniciar a aplicação em um único comando, use:
```
npm run setup-and-start
```
Isso executará a configuração do banco de dados e, em seguida, iniciará ambos os servidores.

## Estrutura do Projeto

- **Arquivos Frontend**:
  - `src/App.jsx`: Componente principal do React que define o layout e a funcionalidade da aplicação.
  - `src/index.js`: Ponto de entrada para a aplicação React.
  - `src/index.css`: CSS personalizado para a aplicação.
  - `public/index.html`: Modelo HTML para o aplicativo React.
- **Arquivos Backend**:
  - `server.js`: Servidor Node.js/Express que fornece endpoints de API para recuperação de dados do banco de dados MySQL.
- **Configuração do Banco de Dados**:
  - `setup_database.sql`: Script SQL para criar o banco de dados, tabelas e inserir dados de exemplo para `pedidos` e `entregadores`.
  - `run_setup_database.bat`: Arquivo batch para executar o script SQL para configuração do banco de dados.
- **Configuração**:
  - `package.json`: Define as dependências do projeto e scripts para executar a aplicação.
  - `tailwind.config.js` e `postcss.config.js`: Configuração para Tailwind CSS e PostCSS.

## Endpoints da API

O servidor backend fornece os seguintes endpoints de API para buscar dados dinamicamente:

- **GET /api/pedidos**: Recupera uma lista de todos os pedidos do banco de dados.
- **GET /api/entregadores**: Recupera uma lista de todos os entregadores.
- **GET /api/dashboard-stats**: Busca estatísticas importantes para o painel (pedidos de hoje, receita total, tempo médio de entrega, número de entregadores).
- **GET /api/graph-tempo-medio**: Fornece dados para o gráfico de tempo médio de entrega (atualmente estático).
- **GET /api/graph-taxa-entrega**: Fornece dados para o gráfico de taxa de entrega, calculado a partir de registros do banco de dados.
- **GET /api/graph-pedidos-dia**: Fornece dados para o gráfico de pedidos por dia, baseado em registros do banco de dados.
- **GET /api/graph-faturamento-dia**: Fornece dados para o gráfico de receita por dia, baseado em registros do banco de dados.

## Notas

- Certifique-se de que o MySQL está instalado e funcionando no seu sistema antes de configurar o banco de dados. Ajuste as credenciais em `server.js` e `run_setup_database.bat` se necessário.
- A aplicação usa um fallback para dados mock se as consultas ao banco de dados falharem, garantindo funcionalidade mesmo sem uma conexão com o banco de dados.
- Para implantação em produção, considere otimizar o build com `npm run build` e proteger as credenciais do banco de dados.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes (se aplicável).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request ou abrir uma Issue no GitHub para quaisquer bugs, solicitações de funcionalidades ou melhorias.
