<template>
  <main class="flex flex-col justify-center items-center gap-5 h-screen">
    <h1>Ben je een student of docent?</h1>
    <div class="flex gap-5">
      <router-link
        class="px-4 py-1 border border-neutral-200 shadow rounded-md"
        to="/student"
      >
        Student
      </router-link>
      <router-link
        class="px-4 py-1 border border-neutral-200 shadow rounded-md"
        to="/docent"
      >
        Docent
      </router-link>
      <router-link
        class="px-4 py-1 border border-neutral-200 shadow rounded-md"
        to="/klant"
      >
        Klant
      </router-link>
    </div>
  </main>
</template>
