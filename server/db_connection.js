import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  user: 'root',
  host: '0.0.0.0',
  database: 'clientes',
  password: '123456',
  port: 5438,
})

export default pool
