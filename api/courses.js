const snowflake = require('snowflake-sdk');

module.exports = function handler(req, res) {
  console.log('API called');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Creating connection...');
  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME, // your corrected var
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE
  });

  connection.connect((err) => {
    if (err) {
      console.error('Connection error:', err.message);
      return res.status(500).json({ error: 'Connection failed', details: err.message });
    }
    console.log('Connected to Snowflake');

    connection.execute({
      sqlText: 'SELECT COURSE_NAME, PRICE, CATEGORY FROM COURSES_TABLE;',
      complete: (err, stmt, rows) => {
        connection.destroy();
        if (err) {
          console.error('Query error:', err.message);
          return res.status(500).json({ error: 'Query failed', details: err.message });
        }
        console.log('Query successful:', rows.length, 'rows');
        return res.status(200).json(rows);
      }
    });
  });
};
