import pool from "../config/db.js";
export const createSignal = async (signalData) => {
  const {
    symbol,
    direction,
    entry_price,
    stop_loss,
    target_price,
    entry_time,
    expiry_time,
  } = signalData;

// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS signals (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     symbol VARCHAR(20) NOT NULL,
//     direction VARCHAR(10) CHECK(direction IN ('BUY','SELL')),
//     entry_price DECIMAL(18,8) NOT NULL,
//     stop_loss DECIMAL(18,8) NOT NULL,
//     target_price DECIMAL(18,8) NOT NULL,
//     entry_time TIMESTAMP NOT NULL,
//     expiry_time TIMESTAMP NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     status VARCHAR(20) DEFAULT 'OPEN',
//     realized_roi DECIMAL(10,2)
// );`

  const query = `
    INSERT INTO signals (
      symbol,
      direction,
      entry_price,
      stop_loss,
      target_price,
      entry_time,
      expiry_time
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;

  const values = [
    symbol,
    direction,
    entry_price,
    stop_loss,
    target_price,
    entry_time,
    expiry_time,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getAllSignals = async () => {
  const result = await pool.query(`
    SELECT *
    FROM signals
    ORDER BY created_at DESC
  `);

  return result.rows;
};


export const getSignalById = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM signals
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};


export const deleteSignal = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM signals
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};


export const updateSignalStatus = async (
  id,
  status,
  roi
) => {
  return pool.query(
    `
    UPDATE signals
    SET status = $1,
        realized_roi = $2
    WHERE id = $3
    `,
    [status, roi, id]
  );
};

