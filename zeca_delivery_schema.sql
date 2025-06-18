-- Drop the existing database if it exists (use with caution)
-- DROP DATABASE IF EXISTS zeca_delivery;

-- Create the database
CREATE DATABASE IF NOT EXISTS zeca_delivery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE zeca_delivery;

-- Create the pedidos table with the updated schema
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    status ENUM('Entregue', 'Em andamento', 'Cancelado') NOT NULL,
    valor VARCHAR(20) NOT NULL,
    detalhes TEXT,
    endereco TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the entregadores table
CREATE TABLE IF NOT EXISTS entregadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    status ENUM('Disponivel', 'Em entrega', 'Indisponivel') NOT NULL,
    contato VARCHAR(255) NOT NULL,
    info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optionally, insert sample data for testing
INSERT INTO pedidos (cliente, status, valor, detalhes, endereco, created_at) VALUES
('Joao Silva', 'Entregue', 'R$ 85,00', 'Pedido entregue no prazo. Itens: 2 pizzas.', 'Rua das Flores, 123', '2025-06-10 14:30:00'),
('Maria Oliveira', 'Em andamento', 'R$ 120,00', 'Pedido em rota de entrega. Itens: 3 hamburgueres.', 'Av. Paulista, 456', '2025-06-18 09:00:00'),
('Pedro Santos', 'Cancelado', 'R$ 65,00', 'Pedido cancelado pelo cliente. Motivo: Mudanca de planos.', 'Rua do Comercio, 789', '2025-06-15 10:15:00'),
('Ana Costa', 'Entregue', 'R$ 45,00', 'Pedido entregue. Itens: 1 sushi combo.', 'Rua Verde, 321', '2025-06-12 18:45:00'),
('Lucas Almeida', 'Entregue', 'R$ 78,50', 'Pedido entregue. Itens: 2 pratos de massa.', 'Av. Central, 987', '2025-06-11 12:20:00'),
('Fernanda Lima', 'Entregue', 'R$ 92,00', 'Pedido entregue no prazo. Itens: 3 pizzas familiares.', 'Rua Azul, 654', '2025-06-09 19:10:00'),
('Rafael Pereira', 'Entregue', 'R$ 33,00', 'Pedido entregue. Itens: 1 salada especial.', 'Rua Amarela, 111', '2025-06-14 13:55:00'),
('Beatriz Souza', 'Entregue', 'R$ 110,00', 'Pedido entregue. Itens: 4 lanches gourmet.', 'Av. Nova, 222', '2025-06-13 17:30:00'),
('Carlos Mendes', 'Entregue', 'R$ 67,80', 'Pedido entregue no prazo. Itens: 2 sobremesas e 1 bebida.', 'Rua Velha, 333', '2025-06-08 20:00:00'),
('Juliana Rocha', 'Entregue', 'R$ 54,20', 'Pedido entregue. Itens: 1 prato vegetariano.', 'Rua Branca, 444', '2025-06-07 11:45:00'),
('Mariana Ferreira', 'Cancelado', 'R$ 88,00', 'Pedido cancelado. Motivo: Cliente não estava no local.', 'Rua das Palmeiras, 555', '2025-06-16 15:20:00'),
('Thiago Oliveira', 'Cancelado', 'R$ 42,50', 'Pedido cancelado pelo cliente. Motivo: Pedido errado.', 'Av. das Árvores, 666', '2025-06-17 09:30:00'),
('Camila Ribeiro', 'Cancelado', 'R$ 75,00', 'Pedido cancelado. Motivo: Atraso na entrega.', 'Rua dos Lírios, 777', '2025-06-14 11:10:00'),
('Gabriel Santos', 'Em andamento', 'R$ 60,00', 'Pedido em preparação. Itens: 2 lanches e 1 bebida.', 'Rua das Rosas, 888', '2025-06-18 10:00:00'),
('Isabela Almeida', 'Em andamento', 'R$ 95,00', 'Pedido em rota de entrega. Itens: 3 pizzas médias.', 'Av. do Sol, 999', '2025-06-18 08:45:00'),
('Eduardo Lima', 'Em andamento', 'R$ 38,00', 'Pedido em preparação. Itens: 1 prato do dia.', 'Rua da Lua, 101', '2025-06-17 16:20:00');

INSERT INTO entregadores (nome, status, contato, info) VALUES
('Carlos Almeida', 'Disponivel', 'carlos.almeida@email.com', 'Entregador desde janeiro de 2022. Disponivel para entregas na regiao central.'),
('Ana Ribeiro', 'Em entrega', 'ana.ribeiro@email.com', 'Atualmente em entrega na zona sul. Previsao de retorno em 30 minutos.'),
('Rafael Lima', 'Indisponivel', 'rafael.lima@email.com', 'Em licenca ate o proximo mes.');
