const express = require('express');
const router = express.Router();

// Helper function to format currency
const formatCurrency = (value) => {
  if (typeof value === 'number' && !isNaN(value)) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
  return 'R$ 0,00';
};

// API endpoint for dashboard stats
router.get('/stats', async (req, res) => {
  const db = req.app.get('db');
  try {
    // Fetch data with separate queries for clarity and performance
    const [todayResults, revenueResults, entregadoresResults] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) as pedidosHoje FROM pedidos WHERE DATE(created_at) = CURDATE()`,
          (err, results) => err ? reject(err) : resolve(results)
        );
      }),
      new Promise((resolve, reject) => {
        // Explicitly calculate revenue only for delivered orders
        db.query(
          `SELECT SUM(CAST(REPLACE(REPLACE(valor, 'R$ ', ''), ',', '.') AS DECIMAL(10,2))) as faturamento
           FROM pedidos
           WHERE status = 'Entregue'`,
          (err, results) => err ? reject(err) : resolve(results)
        );
      }),
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) as entregadores FROM entregadores`,
          (err, results) => err ? reject(err) : resolve(results)
        );
      })
    ]);

    const todayData = todayResults[0];
    const revenueData = revenueResults[0];
    const entregadoresData = entregadoresResults[0];
    const faturamentoValue = revenueData.faturamento || 0;

    res.json({
      pedidosHoje: todayData.pedidosHoje,
      faturamento: formatCurrency(faturamentoValue),
      entregadores: entregadoresData.entregadores
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint for graph data - Taxa de Entrega
router.get('/graph-taxa-entrega', async (req, res) => {
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           DATE(created_at) as date, 
           COUNT(CASE WHEN status = 'Entregue' THEN 1 END) as delivered,
           COUNT(*) as total
         FROM pedidos 
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at)`,
        (err, results) => err ? reject(err) : resolve(results)
      );
    });

    // Create labels for the last 7 days
    const labels = [];
    const values = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }

    // Fill values based on query results
    results.forEach(row => {
      const rowDate = new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const index = labels.indexOf(rowDate);
      if (index !== -1 && row.total > 0) {
        values[index] = (row.delivered / row.total) * 100;
      }
    });

    // Fill in zeros for days with no data
    for (let i = 0; i < labels.length; i++) {
      if (typeof values[i] === 'undefined') {
        values[i] = 0;
      }
    }

    res.json({ labels, values });
  } catch (error) {
    console.error('Error fetching taxa de entrega:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint for graph data - Pedidos por Dia
router.get('/graph-pedidos-dia', async (req, res) => {
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           DATE(created_at) as date, 
           COUNT(*) as count 
         FROM pedidos 
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at)`,
        (err, results) => err ? reject(err) : resolve(results)
      );
    });

    // Create labels for the last 7 days
    const labels = [];
    const values = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }

    // Fill values based on query results
    results.forEach(row => {
      const rowDate = new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const index = labels.indexOf(rowDate);
      if (index !== -1) {
        values[index] = row.count;
      }
    });

    // Fill in zeros for days with no data
    for (let i = 0; i < labels.length; i++) {
      if (typeof values[i] === 'undefined') {
        values[i] = 0;
      }
    }

    res.json({ labels, values });
  } catch (error) {
    console.error('Error fetching pedidos por dia:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint for graph data - Faturamento por Dia
router.get('/graph-faturamento-dia', async (req, res) => {
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
           DATE(created_at) as date, 
           SUM(CAST(REPLACE(REPLACE(valor, 'R$ ', ''), ',', '.') AS DECIMAL(10,2))) as total 
         FROM pedidos 
         WHERE status = 'Entregue' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at)`,
        (err, results) => err ? reject(err) : resolve(results)
      );
    });

    // Create labels for the last 7 days
    const labels = [];
    const values = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }

    // Fill values based on query results
    results.forEach(row => {
      const rowDate = new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const index = labels.indexOf(rowDate);
      if (index !== -1) {
        values[index] = row.total || 0;
      }
    });

    // Fill in zeros for days with no data
    for (let i = 0; i < labels.length; i++) {
      if (typeof values[i] === 'undefined') {
        values[i] = 0;
      }
    }

    res.json({ labels, values });
  } catch (error) {
    console.error('Error fetching faturamento por dia:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Removed endpoint for tempo medio as it's no longer used in the project
router.get('/graph-tempo-medio', (req, res) => {
  res.json({
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    values: [0, 0, 0, 0, 0, 0, 0]
  });
});

module.exports = router;
