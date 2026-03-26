const express = require('express');
const router = express.Router();
const worker = require('../lib/workerClient');
const db = require('../db');

router.post('/index-file', async (req, res) => {
  const { path } = req.body;
  try {
    console.log('Indexing file:', path);
    const { data } = await worker.indexFile(path);
    db.upsertFile({ path, dir_id: null, checksum: data.checksum || null, last_indexed: new Date().toISOString(), status: 'indexed' });
    console.log('File indexed successfully');
    res.json({ ok: true, result: data });
  } catch (err) {
    console.error('File indexing failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/reindex-file', async (req, res) => {
  const { path } = req.body;
  try {
    console.log('Reindexing file:', path);
    const { data } = await worker.reindexFile(path);
    db.upsertFile({ path, dir_id: null, checksum: data.checksum || null, last_indexed: new Date().toISOString(), status: 'indexed' });
    console.log('File reindexed successfully');
    res.json({ ok: true, result: data });
  } catch (err) {
    console.error('File reindexing failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/remove-file', async (req, res) => {
  const { path } = req.body;
  try {
    console.log('Removing file from index:', path);
    await worker.removeFile(path);
    db.removeFile(path);
    console.log('File removed successfully');
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to remove file:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
