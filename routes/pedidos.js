const express = require('express');
const router = express.Router();

// API endpoint to get all pedidos
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM pedidos ORDER BY created_at DESC', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to add a new pedido
router.post('/', async (req, res) => {
  const { cliente, status, valor, detalhes, endereco } = req.body;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO pedidos (cliente, status, valor, detalhes, endereco, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [cliente, status, valor, detalhes, endereco || null],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    res.status(201).json({ id: results.insertId, cliente, status, valor, detalhes, endereco, created_at: new Date().toISOString() });
  } catch (error) {
    console.error('Error adding pedido:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to update a pedido
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente, status, valor, detalhes } = req.body;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE pedidos SET cliente = ?, status = ?, valor = ?, detalhes = ? WHERE id = ?',
        [cliente, status, valor, detalhes, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Pedido not found' });
      return;
    }
    res.json({ id: parseInt(id), cliente, status, valor, detalhes });
  } catch (error) {
    console.error('Error updating pedido:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to delete a pedido
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('DELETE FROM pedidos WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Pedido not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting pedido:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
