// /api/get-courses.js
import snowflake from 'snowflake-sdk';

export default async function handler(req, res) {
  console.log("API called");

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    region: process.env.SNOWFLAKE_REGION,
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error("Unable to connect: " + err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("Connected to Snowflake");

    connection.execute({
      sqlText: `SELECT * FROM COURSES;`,
      complete: function (err, stmt, rows) {
        if (err) {
          console.error("Failed to execute query: " + err.message);
          return res.status(500).json({ error: err.message });
        }

        // ✅ Send result and close connection
        res.status(200).json(rows);

        connection.destroy(); // Important! Close connection
      },
    });
  });
}
