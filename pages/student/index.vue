<script setup lang="ts">
import StudentForm from '~/components/StudentForm.vue';

import { student } from '~/assets/js/student';
import { Chart } from 'chart.js/auto';

const ws = new WebSocket('ws://localhost:3000/_ws')

const chart = ref<HTMLCanvasElement>()
const currStudent = ref()

let data = {
    labels: [
        'Stylen',
        'Front-end',
        'Back-end',
    ],
    datasets: [{
        label: 'Eerste seizoen',
        data: [65, 59, 90],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
}

ws.addEventListener('message', e => {
    console.log(e.data)
})

watch(chart, canvas => {
    if (!canvas) return

    ws.send('test')

    new Chart(canvas, {
        type: 'radar',
        data
    })
})

watch(student, async () => {
    if (!student.number) return

    currStudent.value = await student.getData()
})
</script>

<template>
    <StudentForm v-if="student.number <= 0" />

    <div v-if="student.number" class="flex flex-col-reverse lg:flex-row items-center justify-between w-full min-h-screen">
        <div class="flex flex-col items-center justify-center gap-3 w-full h-screen px-10">
            <h1 class="w-full text-xl font-bold">Welkom {{ currStudent?.name }}</h1>
            <h2 class="w-full pl-2">Opmerkingen:</h2>
            <div class="flex flex-col w-full pl-2 gap-2 lg:max-h-[25rem] lg:overflow-y-scroll lg:pb-0 pb-6">
                <div v-for="i in 10" class="w-full bg-neutral-100 border border-neutral-200 shadow-md rounded-md px-4 py-2">
                    <h1 class="font-bold">test {{ i }}</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus necessitatibus blanditiis quidem ducimus. Provident mollitia maiores animi, inventore, beatae odio totam, in voluptatum quae labore delectus vel eos cum possimus!</p>
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center w-full max-w-xl xl:max-w-none lg:h-screen pt-20 px-10">
            <canvas class="" ref="chart"></canvas>
        </div>
    </div>
</template>