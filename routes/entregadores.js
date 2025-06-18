const express = require('express');
const router = express.Router();

// API endpoint to get all entregadores
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM entregadores', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching entregadores:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to add a new entregador
router.post('/', async (req, res) => {
  const { nome, status, contato, info } = req.body;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO entregadores (nome, status, contato, info) VALUES (?, ?, ?, ?)',
        [nome, status, contato, info],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    res.status(201).json({ id: results.insertId, nome, status, contato, info });
  } catch (error) {
    console.error('Error adding entregador:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to update an entregador
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, status, contato, info } = req.body;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE entregadores SET nome = ?, status = ?, contato = ?, info = ? WHERE id = ?',
        [nome, status, contato, info, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Entregador not found' });
      return;
    }
    res.json({ id: parseInt(id), nome, status, contato, info });
  } catch (error) {
    console.error('Error updating entregador:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API endpoint to delete an entregador
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.get('db');
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('DELETE FROM entregadores WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Entregador not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting entregador:', error.message, error.sqlMessage, error.sqlState);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
