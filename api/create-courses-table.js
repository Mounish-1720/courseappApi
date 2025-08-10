import snowflake from 'snowflake-sdk';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  console.log("API called");

  // Create connection
  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    region: process.env.SNOWFLAKE_REGION,
  });

  console.log("Creating connection...");

  connection.connect((err, conn) => {
    if (err) {
      console.error("Unable to connect: " + err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("Connected to Snowflake");

    // SQL to create table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS courses (
        id STRING PRIMARY KEY,
        title STRING,
        description STRING,
        price FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    connection.execute({
      sqlText: createTableSQL,
      complete: function (err) {
        // Always close the connection in serverless
        connection.destroy((destroyErr) => {
          if (destroyErr) console.error("Error closing connection:", destroyErr);
        });

        if (err) {
          console.error("Failed to create table: " + err.message);
          return res.status(500).json({ error: err.message });
        }
        console.log("Table created successfully!");
        res.status(200).json({ message: "Courses table created successfully" });
      }
    });
  });
}
