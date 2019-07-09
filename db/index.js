const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgressql://localhost/rottenmangoes'
});

client.connect();

module.exports = client;
