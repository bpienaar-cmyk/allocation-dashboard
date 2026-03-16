import snowflake from 'snowflake-sdk';

// Connection pool for reusing connections across function invocations
let connection: any = null;
let connectionPromise: Promise<any> | null = null;

async function getConnection() {
  if (connection) {
    return connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise((resolve, reject) => {
    const conn = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT || '',
      username: process.env.SNOWFLAKE_USERNAME || '',
      password: process.env.SNOWFLAKE_PASSWORD || '',
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || '',
      database: process.env.SNOWFLAKE_DATABASE || '',
      schema: process.env.SNOWFLAKE_SCHEMA || '',
    });

    conn.connect((err: any) => {
      if (err) {
        connectionPromise = null;
        reject(new Error(`Snowflake connection error: ${err.message}`));
      } else {
        connection = conn;
        connectionPromise = null;
        resolve(conn);
      }
    });
  });

  return connectionPromise;
}

export async function executeQuery(sql: string, binds: any[] = []): Promise<any[]> {
  const conn = await getConnection();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Snowflake query timeout (30s)'));
    }, 30000);

    conn.execute({
      sqlText: sql,
      binds: binds,
      complete: (err: any, stmt: any, rows: any[]) => {
        clearTimeout(timeoutId);

        if (err) {
          reject(new Error(`Snowflake query error: ${err.message}`));
        } else {
          resolve(rows || []);
        }
      },
    });
  });
}

// Optional: Close connection when Lambda container is about to shut down
export function closeConnection() {
  if (connection) {
    connection.destroy((err: any) => {
      if (err) {
        console.error('Error closing Snowflake connection:', err);
      } else {
        console.log('Snowflake connection closed');
        connection = null;
      }
    });
  }
}
