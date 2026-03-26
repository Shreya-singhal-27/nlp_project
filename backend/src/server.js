const app = require('./app');
const { PORT } = require('./config');
const db = require('./db');

// Print startup banner
console.log('='.repeat(80));
console.log('🚀 LUCIDFILES BACKEND SERVER STARTING...');
console.log('='.repeat(80));

const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🌟 BACKEND SERVER READY!`);
  console.log(`🌐 Listening on port ${PORT}`);
  console.log('🔗 Available endpoints:');
  console.log('   • GET  /api/directories - List indexed directories');  
  console.log('   • POST /api/set-directory - Add directory to watch');
  console.log('   • POST /api/search - Search through documents');
  console.log('   • GET  /health - Health check');
  console.log('='.repeat(60));
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutdown signal received...');
  server.close(() => {
    console.log('✅ Backend server shutdown complete!');
    process.exit(0);
  });
});
