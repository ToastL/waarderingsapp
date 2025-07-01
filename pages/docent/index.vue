<script setup>
import { getSkills, getStudent } from '~/assets/js/student';
import DocentForm from '~/components/DocentForm.vue';
import NumberInput from '~/components/NumberInput.vue';
import PencilIcon from '~/components/icons/PencilIcon.vue';

const studenten = reactive([])

function clearStudent() {
    while (studenten.length > 0) studenten.pop()
}

function getStudents() {
    $fetch('/api/student')
        .then(res => {
            clearStudent()

            const numbers = Object.keys(res)

            Object.values(res).map((student, i) => {
                student.number = numbers[i]
                return student
            }).forEach(student => {
                studenten.push(student)
            })
        })
}

getStudents()

const ws = new WebSocket('ws://localhost:3000/_ws')

ws.addEventListener('open', () => {
    console.log('test')
})

ws.addEventListener('message', event => {
    console.log(event)
})

const edit = ref(false)
let currStudent = reactive({
    name: '',
    skills: [

    ]
})

function setSkill(i, level) {
    currStudent.skills[i].level = level
    
}

async function editStudent(number) {
    edit.value = true

    const student = await getStudent(number)
    const skills = await getSkills(number)

    currStudent.name = `${student.voornaam} ${student.achternaam}`
    currStudent.skills = skills

    ws.send({ type: 'get', number })
}
</script>

<template>
    <!-- <DocentForm /> -->

    <div class="flex h-screen justify-center items-center">
        <div
            class="w-5/6 h-5/6 max-w-md bg-neutral-100 rounded-md shadow border border-neutral-200 overflow-hidden">
            <div class="flex w-[200%] h-full transition-transform" :class="{ '-translate-x-1/2': edit }">
                <div class="w-1/2 h-full flex flex-col justify-start items-center gap-2 py-10">
                    <input class="py-1 px-2 bg-neutral-100 rounded-md shadow border border-neutral-200" type="text"
                        name="" placeholder="Student">
                    <div class="w-full px-10 space-y-3 overflow-y-scroll">
                        <div v-for="student in studenten"
                            class="flex justify-between items-center py-1 px-2 w-full bg-neutral-100 rounded-md shadow border border-neutral-200">
                            <h1 class="font-bold">{{ student.name }}</h1>
                            <button @click="editStudent(student.number)"
                                class="flex justify-center items-center p-2 w-8 h-8 bg-green-400 rounded-md shadow">
                                <PencilIcon class="fill-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col justify-start items-center w-1/2 h-full py-10 gap-2">
                    <h1 class="font-bold text-xl">{{ currStudent.name }}</h1>
                    <div v-for="skill, i in currStudent.skills" class="flex flex-col items-center">
                        <h1>{{ skill.titel }}</h1>
                        <NumberInput :length="10" :value="skill.level" @change="e => setSkill(i, e)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>