import { studenten } from "~/server/dummyData"

export default defineEventHandler(event => {
    return studenten
})