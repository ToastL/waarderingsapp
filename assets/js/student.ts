import { session } from "./sessionKey"

export const student = reactive({
    number: 0,
    async setNumber(number: number): Promise<boolean> {
        session.setKey()
        const success = await $fetch(`/api/student/${number}?s=${session.key}`)

        if (!success) return false

        this.number = number
        return true
    },
    async getData() {
        session.setKey()
        const student = await $fetch(`/api/student/${this.number}?s=${session.key}`)

        return student
    },
    async getStudentData(number: number) {
        session.setKey()
        const student = await $fetch(`/api/student/${number}?s=${session.key}`)

        return student
    }
})

export async function getStudent(number: number) {
    session.setKey()
    const student = await $fetch(`/api/student/${number}?s=${session.key}`)

    return student
}

export async function getSkills(number: number) {
    session.setKey()
    const skills = await $fetch(`/api/student/${number}/skills?s=${session.key}`)

    return skills
}

export async function setSkill(id: number) {
    session.setKey()
    const success
}