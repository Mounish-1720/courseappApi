import snowflake from 'snowflake-sdk';


const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,  
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
  role: process.env.SNOWFLAKE_ROLE
});

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }


  connection.connect((err, conn) => {
    if (err) {
      console.error('Connection failed: ' + err.message);
      return res.status(500).json({ error: 'Database connection failed' });
    }


    const query = `
      SELECT COURSE_NAME, PRICE, CATEGORY
      FROM COURSES_TABLE;
    `;

    conn.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        connection.destroy(); // Close after query

        if (err) {
          console.error('Query failed: ' + err.message);
          return res.status(500).json({ error: 'Query failed' });
        }

        res.status(200).json(rows);
      }
    });
  });
}
