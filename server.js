const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'zeca_delivery',
  charset: 'utf8mb4'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Mock data for pedidos
const mockPedidos = [
  { id: 1, order_id: '#001', cliente: 'Joao Silva', status: 'Entregue', valor: 'R$ 85,00', detalhes: 'Pedido entregue no prazo. Endereco: Rua das Flores, 123. Itens: 2 pizzas.' },
  { id: 2, order_id: '#002', cliente: 'Maria Oliveira', status: 'Em andamento', valor: 'R$ 120,00', detalhes: 'Pedido em rota de entrega. Endereco: Av. Paulista, 456. Itens: 3 hamburgueres.' },
  { id: 3, order_id: '#003', cliente: 'Pedro Santos', status: 'Cancelado', valor: 'R$ 65,00', detalhes: 'Pedido cancelado pelo cliente. Motivo: Mudanca de planos. Endereco: Rua do Comercio, 789.' },
  { id: 4, order_id: '#004', cliente: 'Ana Costa', status: 'Entregue', valor: 'R$ 95,00', detalhes: 'Pedido entregue com sucesso. Endereco: Rua das Palmeiras, 321. Itens: 1 sushi.' },
  { id: 5, order_id: '#005', cliente: 'Lucas Almeida', status: 'Em andamento', valor: 'R$ 110,00', detalhes: 'Pedido em preparacao. Endereco: Av. Brasil, 789. Itens: 4 sanduiches.' },
  { id: 6, order_id: '#006', cliente: 'Fernanda Lima', status: 'Cancelado', valor: 'R$ 50,00', detalhes: 'Pedido cancelado por falta de estoque. Endereco: Rua do Sol, 456. Itens: 2 saladas.' },
  { id: 7, order_id: '#007', cliente: 'Rafael Mendes', status: 'Entregue', valor: 'R$ 130,00', detalhes: 'Pedido entregue no prazo. Endereco: Av. Central, 123. Itens: 3 pizzas.' },
  { id: 8, order_id: '#008', cliente: 'Beatriz Souza', status: 'Em andamento', valor: 'R$ 75,00', detalhes: 'Pedido em rota. Endereco: Rua da Paz, 987. Itens: 1 bolo.' },
  { id: 9, order_id: '#009', cliente: 'Gabriel Rocha', status: 'Entregue', valor: 'R$ 88,00', detalhes: 'Pedido entregue com sucesso. Endereco: Av. das Nacoes, 654. Itens: 2 hamburgueres.' },
  { id: 10, order_id: '#010', cliente: 'Camila Pereira', status: 'Cancelado', valor: 'R$ 45,00', detalhes: 'Pedido cancelado pelo cliente. Endereco: Rua da Esperanca, 321. Itens: 1 sobremesa.' }
];

// API endpoint to get all pedidos
app.get('/api/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) {
      console.error('Error fetching pedidos:', err);
      res.json(mockPedidos); // Return mock data on error
      return;
    }
    res.json(results);
  });
});

// Mock data for entregadores
const mockEntregadores = [
  { id: 1, nome: 'Carlos Almeida', status: 'Disponivel', contato: 'carlos.almeida@email.com', info: 'Entregador desde janeiro de 2022. Disponivel para entregas na regiao central.' },
  { id: 2, nome: 'Ana Ribeiro', status: 'Em entrega', contato: 'ana.ribeiro@email.com', info: 'Atualmente em entrega na zona sul. Previsao de retorno em 30 minutos.' },
  { id: 3, nome: 'Rafael Lima', status: 'Indisponivel', contato: 'rafael.lima@email.com', info: 'Em licenca ate o proximo mes.' },
  { id: 4, nome: 'Beatriz Silva', status: 'Disponivel', contato: 'beatriz.silva@email.com', info: 'Disponivel para entregas na zona norte.' },
  { id: 5, nome: 'Diego Santos', status: 'Em entrega', contato: 'diego.santos@email.com', info: 'Entrega em andamento na regiao oeste.' },
  { id: 6, nome: 'Fernanda Oliveira', status: 'Indisponivel', contato: 'fernanda.oliveira@email.com', info: 'Em manutencao de veiculo.' },
  { id: 7, nome: 'Gabriel Pereira', status: 'Disponivel', contato: 'gabriel.pereira@email.com', info: 'Disponivel para entregas na regiao leste.' },
  { id: 8, nome: 'Juliana Mendes', status: 'Em entrega', contato: 'juliana.mendes@email.com', info: 'Entrega em andamento no centro.' },
  { id: 9, nome: 'Lucas Ferreira', status: 'Indisponivel', contato: 'lucas.ferreira@email.com', info: 'Em treinamento ate proxima semana.' },
  { id: 10, nome: 'Mariana Costa', status: 'Disponivel', contato: 'mariana.costa@email.com', info: 'Disponivel para entregas em qualquer regiao.' }
];

// API endpoint to get all entregadores
app.get('/api/entregadores', (req, res) => {
  db.query('SELECT * FROM entregadores', (err, results) => {
    if (err) {
      console.error('Error fetching entregadores:', err);
      res.json(mockEntregadores); // Return mock data on error
      return;
    }
    res.json(results);
  });
});

// API endpoint for dashboard statistics
app.get('/api/dashboard-stats', (req, res) => {
  // Query for pedidos hoje (today's orders)
  db.query("SELECT COUNT(*) as count FROM pedidos WHERE DATE(created_at) = CURDATE()", (err, pedidosHojeResult) => {
    if (err) {
      console.error('Error fetching pedidos hoje:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Query for total faturamento (sum of valor for all delivered orders)
    db.query("SELECT SUM(CAST(REPLACE(REPLACE(valor, 'R$ ', ''), ',', '.') AS DECIMAL(10,2))) as total FROM pedidos WHERE status = 'Entregue'", (err, faturamentoResult) => {
      if (err) {
        console.error('Error fetching faturamento:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Faturamento Result:', faturamentoResult); // Debug log

      // Query for total entregadores
      db.query("SELECT COUNT(*) as count FROM entregadores", (err, entregadoresResult) => {
        if (err) {
          console.error('Error fetching entregadores count:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        const totalFaturamento = faturamentoResult[0].total !== null ? parseFloat(faturamentoResult[0].total) : 0;
        const stats = {
          pedidosHoje: pedidosHojeResult[0].count,
          faturamento: `R$ ${totalFaturamento.toFixed(2).replace('.', ',')}`,
          tempoMedio: '24 min', // Static for now as it requires additional data not in schema
          entregadores: entregadoresResult[0].count
        };
        res.json(stats);
      });
    });
  });
});

// API endpoint for graph data - Tempo Médio de Entrega (Static for now as it requires additional data)
app.get('/api/graph-tempo-medio', (req, res) => {
  const data = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    values: [25, 22, 28, 24, 30, 27, 23]
  };
  res.json(data);
});

// API endpoint for graph data - Taxa de Entrega
app.get('/api/graph-taxa-entrega', (req, res) => {
  db.query("SELECT DAYNAME(created_at) as day, (COUNT(CASE WHEN status = 'Entregue' THEN 1 END) / COUNT(*)) * 100 as rate FROM pedidos GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at) ORDER BY DAYOFWEEK(created_at)", (err, results) => {
    if (err) {
      console.error('Error fetching taxa de entrega:', err);
      return res.json({
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        values: [95, 92, 98, 90, 88, 93, 96]
      });
    }
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const values = new Array(7).fill(0);
    results.forEach(row => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(row.day);
      if (dayIndex !== -1) {
        values[dayIndex] = row.rate;
      }
    });
    res.json({
      labels: labels,
      values: values
    });
  });
});

// API endpoint for graph data - Pedidos por Dia
app.get('/api/graph-pedidos-dia', (req, res) => {
  db.query("SELECT DAYNAME(created_at) as day, COUNT(*) as count FROM pedidos GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at) ORDER BY DAYOFWEEK(created_at)", (err, results) => {
    if (err) {
      console.error('Error fetching pedidos por dia:', err);
      return res.json({
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        values: [15, 18, 12, 20, 22, 17, 14]
      });
    }
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const values = new Array(7).fill(0);
    results.forEach(row => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(row.day);
      if (dayIndex !== -1) {
        values[dayIndex] = row.count;
      }
    });
    res.json({
      labels: labels,
      values: values
    });
  });
});

// API endpoint for graph data - Faturamento por Dia
app.get('/api/graph-faturamento-dia', (req, res) => {
  db.query("SELECT DAYNAME(created_at) as day, SUM(CAST(REPLACE(REPLACE(valor, 'R$ ', ''), ',', '.') AS DECIMAL(10,2))) as total FROM pedidos WHERE status = 'Entregue' GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at) ORDER BY DAYOFWEEK(created_at)", (err, results) => {
    if (err) {
      console.error('Error fetching faturamento por dia:', err);
      return res.json({
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        values: [450, 520, 380, 610, 700, 550, 480]
      });
    }
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const values = new Array(7).fill(0);
    results.forEach(row => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(row.day);
      if (dayIndex !== -1) {
        values[dayIndex] = row.total || 0;
      }
    });
    res.json({
      labels: labels,
      values: values
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
