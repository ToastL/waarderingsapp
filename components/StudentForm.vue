<script setup lang="ts">
import { ref, watch } from 'vue'
import { student } from '~/assets/js/student'

const studentNumber = ref<number>()
const currStudent = ref()

let typingTimer: undefined | ReturnType<typeof setTimeout>
const TYPE_INTERVAL = 500

watch(studentNumber, () => {
  currStudent.value = undefined

  clearTimeout(typingTimer)
  typingTimer = setTimeout(doneTyping, TYPE_INTERVAL)
})

function submit() {
  if (!studentNumber.value) return

  if (!student.setNumber(studentNumber.value)) studentNumber.value = undefined
}

async function doneTyping() {
  if (!studentNumber.value) return
  
  currStudent.value = await student.getStudentData(studentNumber.value).then(res => {
    if (!res) return
    return `${res?.voornaam} ${res?.achternaam}`
  })
}
</script>

<template>
  <form
    class="flex flex-col items-center justify-center w-full h-screen gap-5"
    @submit.prevent="submit"
  >
    <h1 class="text-lg font-bold">Wie ben jij?</h1>
    <input
      class="px-4 py-1 w-52 border border-neutral-200 rounded-md shadow outline-none focus:border-success-400 transition-colors"
      v-model="studentNumber"
      type="number"
      name="student"
      id="student"
      placeholder="Studenten nummer"
    />
    <p v-if="currStudent">Ben jij "{{ currStudent }}"?</p>
    <input
      class="px-4 py-1 bg-green-400 border border-green-500 rounded-md shadow text-white"
      type="submit"
      value="Submit"
    />
  </form>
</template>
