import { studenten } from "~/server/dummyData"

import { createConnectionPool } from "~/server/pool"

export default defineEventHandler(async event => {
    const { s: sessionKey }: { s: string } = getQuery(event)

    const studentNumber = Number(event.context.params?.id)

    const db = createConnectionPool(sessionKey)
    
    const student = await db.then(async res => {
        return (await res.query('SELECT voornaam, achternaam FROM studenten WHERE leerlingnummer = $1::bigint LIMIT 1', [studentNumber])).rows[0]
    })

    if (!student) return
    return student
})