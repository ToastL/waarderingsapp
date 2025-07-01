import { createConnectionPool } from "~/server/pool"

export default defineEventHandler(async event => {
    const { s: sessionKey }: { s: string } = getQuery(event)

    const studentNumber = Number(event.context.params?.id)

    const db = await createConnectionPool(sessionKey)

    const skills = await db.query(`SELECT studenten_skills.id, studenten.leerlingnummer, skills.titel, studenten_skills.level FROM studenten_skills JOIN skills ON studenten_skills.skill_id=skills.id JOIN studenten ON studenten_skills.student_id=studenten.id WHERE leerlingnummer=${studentNumber}`)

    return skills.rows
})