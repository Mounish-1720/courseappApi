const snowflake = require('snowflake-sdk');

module.exports = function handler(req, res) {
  console.log('API called');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE,
  });

  console.log('Creating connection...');

  connection.connect((err) => {
    if (err) {
      console.error('Connection error:', err.message);
      return res.status(500).json({ error: 'Connection failed', details: err.message });
    }

    console.log('Connected to Snowflake');

    console.log('Executing query: SELECT 1;');

    connection.execute({
      sqlText: 'SELECT 1;',
      complete: (err, stmt, rows) => {
        console.log('Query callback triggered');
        connection.destroy();

        if (err) {
          console.error('Query error:', err.message);
          return res.status(500).json({ error: 'Query failed', details: err.message });
        }

        console.log('Query success:', rows);
        return res.status(200).json(rows);
      },
    });

    console.log('Execute called');
  });
};
