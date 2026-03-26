const express = require('express');
const fs = require('fs');
const router = express.Router();
const db = require('../db');
const worker = require('../lib/workerClient');

router.post('/set-directory', async (req, res) => {
  const { path } = req.body;
  
  if (!path || !fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
    console.log('Invalid directory path provided:', path);
    return res.status(400).json({ error: 'Invalid directory path' });
  }
  
  console.log('Adding directory to index:', path);
  const dir = db.addDirectory(path);
  
  try {
    console.log('Starting initial directory indexing...');
    // initial full index (blocking) - worker handles chunking
    await worker.indexDirectory(path);
    console.log('Directory indexed successfully');
    console.log('Directory setup complete!');
    res.json({ ok: true, directory: dir });
  } catch (err) {
    console.error('Directory indexing failed:', err.message);
    res.status(500).json({ error: 'Indexing failed', details: err.message });
  }
});

router.get('/directories', (req, res) => {
  res.json(db.listDirectories());
});

router.delete('/directory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('Removing directory from index:', id);
    const result = db.deleteDirectory(id);
    console.log('Directory removed successfully');
    res.json({ ok: true, result });
  } catch (err) {
    console.error('Failed to remove directory:', err.message);
    res.status(500).json({ error: 'Failed to delete directory', details: err.message });
  }
});

module.exports = router;
