// api/courses.js
const snowflake = require('snowflake-sdk');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE
  });
console.log('ENV VARIABLES:', {
  SNOWFLAKE_USER: process.env.SNOWFLAKE_USER,
  SNOWFLAKE_ACCOUNT: process.env.SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_PASSWORD: process.env.SNOWFLAKE_PASSWORD
});
  connection.connect((err) => {
    if (err) {
      console.error('❌ Snowflake connection error:', err.message);
      return res.status(500).json({ error: 'Connection failed', details: err.message });
    }

    connection.execute({
      sqlText: `SELECT COURSE_NAME, PRICE, CATEGORY FROM COURSES_TABLE;`,
      complete: (err, stmt, rows) => {
        connection.destroy();

        if (err) {
          console.error('❌ Snowflake query error:', err.message);
          return res.status(500).json({ error: 'Query failed', details: err.message });
        }

        res.status(200).json(rows);
      }
    });
  });
};
