# Zeca Delivery Painel

## Introdução

Zeca Delivery Painel é uma aplicação web para gerenciar pedidos e entregadores de um serviço de delivery. Este painel oferece uma interface intuitiva com dashboards para monitorar estatísticas como pedidos do dia, faturamento, tempo médio de entrega e status dos entregadores. Desenvolvido com React no frontend e Express.js no backend, utiliza um banco de dados MySQL para armazenar informações.

## Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação no seu ambiente local:

1. **Configurar o Banco de Dados**:
   Execute o script de setup do banco de dados para criar as tabelas e inserir dados de exemplo:
   ```
   .\run_setup_database.bat
   ```
   **Nota**: Certifique-se de que o MySQL está instalado e que o caminho para `mysql.exe` no script está correto. Caso contrário, execute o script manualmente com `mysql -u root -p < setup_database.sql` e forneça a senha quando solicitado.

2. **Iniciar o Servidor Backend**:
   Inicie o servidor Express.js que se conecta ao banco de dados MySQL e fornece os endpoints da API:
   ```
   node server.js
   ```

3. **Iniciar o Frontend React**:
   Inicie a aplicação React que serve a interface do usuário:
   ```
   npm start
   ```
   **Nota**: Se houver um conflito de porta (padrão 3000), você será perguntado se deseja usar outra porta (por exemplo, 3002). Caso contrário, configure manualmente com `PORT=3002 npm start`.

4. **Acessar a Aplicação**:
   Após iniciar ambos os servidores, acesse a aplicação no navegador:
   ```
   start http://localhost:3000
   ```
   ou
   ```
   start http://localhost:3002
   ```
   dependendo da porta usada pelo frontend.

## Requisitos

- **Node.js** e **npm** para executar o backend e frontend.
- **MySQL** para o banco de dados. Certifique-se de que está configurado com as credenciais corretas (usuário `root` e senha `12345` por padrão, ou ajuste em `server.js`).

## Solução de Problemas

- Se o banco de dados não for configurado corretamente, verifique se o MySQL está instalado e funcionando, e se as credenciais estão corretas.
- Se houver conflitos de porta, ajuste as portas manualmente ou finalize processos que estejam usando as portas 3000 ou 3001.
