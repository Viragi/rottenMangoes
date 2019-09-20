const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/rottenmangoes',
  ssl: process.env.DATABASE_URL ? true : false
});

client.connect();

module.exports = client;
