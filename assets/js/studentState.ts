export const student = reactive({
    number: 0,
    async setNumber(number: number): Promise<boolean> {
        const success = await $fetch(`/api/student/${number}`)

        if (!success) return false

        this.number = number
        return true
    },
    async getData() {
        const student = await $fetch(`/api/student/${this.number}`)

        return student
    },
    async getStudentData(number: number) {
        const student = await $fetch(`/api/student/${number}`)

        return student
    }
})