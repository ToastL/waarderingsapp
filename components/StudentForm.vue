<script setup lang="ts">
import { ref, watch } from "vue";
import { student } from "~/assets/js/student";

const studentNumber = ref<number>();
const currStudent = ref();

let typingTimer: undefined | ReturnType<typeof setTimeout>;
const TYPE_INTERVAL = 500;

watch(studentNumber, () => {
  currStudent.value = undefined;

  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, TYPE_INTERVAL);
});

function submit() {
  if (!studentNumber.value) return;

  if (!student.setNumber(studentNumber.value)) studentNumber.value = undefined;
}

async function doneTyping() {
  if (!studentNumber.value) return;

  currStudent.value = await student
    .getStudentData(studentNumber.value)
    .then((res) => {
      if (!res) return;
      return `${res?.voornaam} ${res?.achternaam}`;
    });
}
</script>

<template>
  <div class="student-form-page">
    <!-- Header -->
    <header class="student-form-header">
      <button @click="navigateTo('/')" class="back-button" aria-label="Terug">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="header-title">STUDENT LOGIN</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Main Content -->
    <div class="student-form-content">
      <div class="login-form-container">
        <form class="login-form" @submit.prevent="submit">
          <h2 class="form-question">Wie ben jij?</h2>

          <div class="input-section">
            <label class="input-label">Studentnummer</label>
            <input
              class="student-input"
              v-model="studentNumber"
              type="number"
              name="student"
              id="student"
              placeholder="Voer je studentnummer in..."
            />
          </div>

          <div v-if="currStudent" class="confirmation-section">
            <p class="confirmation-text">
              Ben jij <strong>"{{ currStudent }}"</strong>?
            </p>
          </div>

          <button
            class="submit-button"
            type="submit"
            :disabled="!studentNumber"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.student-form-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 1px;
}

.header-spacer {
  width: 40px;
}

.student-form-content {
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
}

.login-form-container {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-question {
  font-size: 18px;
  color: #374151;
  margin: 0;
  font-weight: 500;
  text-align: center;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.student-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.student-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.confirmation-section {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 16px;
}

.confirmation-text {
  font-size: 14px;
  color: #0c4a6e;
  margin: 0;
  text-align: center;
}

.submit-button {
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .student-form-content {
    padding: 16px;
  }

  .login-form-container {
    padding: 24px 16px;
  }

  .form-question {
    font-size: 16px;
  }
}
</style>
