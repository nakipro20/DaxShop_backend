const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // requieren conexiones seguras
    rejectUnauthorized: false 
  }
});

// Prueba de conexión rápida al iniciar
pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos PostgreSQL (Neon)'))
  .catch(err => console.error('Error al conectar con la base de datos:', err.stack));

module.exports = pool;