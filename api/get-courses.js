import snowflake from 'snowflake-sdk';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET requests allowed' });
  }

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    region: process.env.SNOWFLAKE_REGION,
  });

  connection.connect((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.execute({
      sqlText: 'SELECT * FROM courses ORDER BY created_at DESC',
      complete: (err, stmt, rows) => {
        connection.destroy();
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
      }
    });
  });
}
