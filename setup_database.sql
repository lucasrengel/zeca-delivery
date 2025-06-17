-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS zeca_delivery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE zeca_delivery;

-- Create table for pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL UNIQUE,
    cliente VARCHAR(100) NOT NULL,
    status ENUM('Entregue', 'Em andamento', 'Cancelado') NOT NULL,
    valor VARCHAR(20) NOT NULL,
    detalhes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for entregadores
CREATE TABLE IF NOT EXISTS entregadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    status ENUM('Disponivel', 'Em entrega', 'Indisponivel') NOT NULL,
    contato VARCHAR(100) NOT NULL,
    info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for pedidos
INSERT INTO pedidos (order_id, cliente, status, valor, detalhes) VALUES
('#001', 'João Silva', 'Entregue', 'R$ 85,00', 'Pedido entregue no prazo. Endereço: Rua das Flores, 123. Itens: 2 pizzas.'),
('#002', 'Maria Oliveira', 'Em andamento', 'R$ 120,00', 'Pedido em rota de entrega. Endereço: Av. Paulista, 456. Itens: 3 hambúrgueres.'),
('#003', 'Pedro Santos', 'Cancelado', 'R$ 65,00', 'Pedido cancelado pelo cliente. Motivo: Mudança de planos. Endereço: Rua do Comércio, 789.'),
('#004', 'Ana Costa', 'Entregue', 'R$ 95,00', 'Pedido entregue com sucesso. Endereço: Rua das Palmeiras, 321. Itens: 1 sushi.'),
('#005', 'Lucas Almeida', 'Em andamento', 'R$ 110,00', 'Pedido em preparação. Endereço: Av. Brasil, 789. Itens: 4 sanduíches.'),
('#006', 'Fernanda Lima', 'Cancelado', 'R$ 50,00', 'Pedido cancelado por falta de estoque. Endereço: Rua do Sol, 456. Itens: 2 saladas.'),
('#007', 'Rafael Mendes', 'Entregue', 'R$ 130,00', 'Pedido entregue no prazo. Endereço: Av. Central, 123. Itens: 3 pizzas.'),
('#008', 'Beatriz Souza', 'Em andamento', 'R$ 75,00', 'Pedido em rota. Endereço: Rua da Paz, 987. Itens: 1 bolo.'),
('#009', 'Gabriel Rocha', 'Entregue', 'R$ 88,00', 'Pedido entregue com sucesso. Endereço: Av. das Nações, 654. Itens: 2 hambúrgueres.'),
('#010', 'Camila Pereira', 'Cancelado', 'R$ 45,00', 'Pedido cancelado pelo cliente. Endereço: Rua da Esperança, 321. Itens: 1 sobremesa.');

-- Insert sample data for entregadores
INSERT INTO entregadores (nome, status, contato, info) VALUES
('Carlos Almeida', 'Disponivel', 'carlos.almeida@email.com', 'Entregador desde janeiro de 2022. Disponível para entregas na região central.'),
('Ana Ribeiro', 'Em entrega', 'ana.ribeiro@email.com', 'Atualmente em entrega na zona sul. Previsão de retorno em 30 minutos.'),
('Rafael Lima', 'Indisponivel', 'rafael.lima@email.com', 'Em licença até o próximo mês.'),
('Beatriz Silva', 'Disponivel', 'beatriz.silva@email.com', 'Disponível para entregas na zona norte.'),
('Diego Santos', 'Em entrega', 'diego.santos@email.com', 'Entrega em andamento na região oeste.'),
('Fernanda Oliveira', 'Indisponivel', 'fernanda.oliveira@email.com', 'Em manutenção de veículo.'),
('Gabriel Pereira', 'Disponivel', 'gabriel.pereira@email.com', 'Disponível para entregas na região leste.'),
('Juliana Mendes', 'Em entrega', 'juliana.mendes@email.com', 'Entrega em andamento no centro.'),
('Lucas Ferreira', 'Indisponivel', 'lucas.ferreira@email.com', 'Em treinamento até próxima semana.'),
('Mariana Costa', 'Disponivel', 'mariana.costa@email.com', 'Disponível para entregas em qualquer região.');
