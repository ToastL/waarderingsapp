import { Pool } from "pg";

(async () => {
    const pool = new Pool({
        host: 'localhost',
        user: 'toaster5',
        database: 'waarderingsapp'
    })

    const res = await pool.query('SELECT * FROM studenten')
    console.log(res.rows)
    await pool.end()
})()