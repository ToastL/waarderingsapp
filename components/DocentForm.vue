<script setup lang="ts">
import { ref, reactive } from 'vue'

const docent = reactive({
    username: '',
    password: ''
})

function submit() {
    if (docent.username == '' || docent.password == '') return

    console.log(docent)
}
</script>

<template>
    <form class="flex flex-col items-center justify-center w-full h-screen gap-5" @submit.prevent="submit">
        <h1 class="text-lg font-bold">Docenten inlog</h1>
        <input
            class="px-4 py-1 w-52 border border-neutral-200 rounded-md shadow outline-none focus:border-success-400 transition-colors"
            v-model="docent.username" type="text" name="docent" placeholder="Gebruikersnaam" />
        <input class="px-4 py-1 w-52 border border-neutral-200 rounded-md shadow outline-none focus:border-success-400 transition-colors"
            v-model="docent.password" type="password" name="password" placeholder="Wachtwoord" />
        <input class="px-4 py-1 bg-green-400 border border-green-500 rounded-md shadow text-white" type="submit"
            value="Submit" />
    </form>
</template>
