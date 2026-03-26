const express = require('express');
const router = express.Router();
const worker = require('../lib/workerClient');

router.post('/search', async (req, res) => {
  const { query, top_k = 5 } = req.body;
  try {
    console.log(' Search request:', query, `(top_k: ${top_k})`);
    const startTime = Date.now();
    const { data } = await worker.search(query, top_k);
    const duration = Date.now() - startTime;
    console.log(`Search completed in ${duration}ms - Found ${data.length} results`);
    res.json({ ok: true, results: data });
  } catch (err) {
    console.error('Search failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// RAG endpoint — placeholder for future LLM integration
router.post('/ask', async (req, res) => {
  res.status(501).json({ 
    error: 'RAG summarization not yet implemented',
    message: 'This endpoint will use LLM-based summarization in a future release'
  });
});

module.exports = router;
