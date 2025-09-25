<script setup>
import { getSkills, getStudent } from "~/assets/js/student";
import DocentForm from "~/components/DocentForm.vue";
import NumberInput from "~/components/NumberInput.vue";
import PencilIcon from "~/components/icons/PencilIcon.vue";

const studenten = reactive([]);

function clearStudent() {
  while (studenten.length > 0) studenten.pop();
}

function getStudents() {
  $fetch("/api/student").then((res) => {
    clearStudent();

    const numbers = Object.keys(res);

    Object.values(res)
      .map((student, i) => {
        student.number = numbers[i];
        return student;
      })
      .forEach((student) => {
        studenten.push(student);
      });
  });
}

getStudents();

const ws = new WebSocket("ws://localhost:3000/_ws");

ws.addEventListener("open", () => {
  console.log("test");
});

ws.addEventListener("message", (event) => {
  console.log(event);
});

const edit = ref(false);
let currStudent = reactive({
  name: "",
  skills: [],
});

function setSkill(i, level) {
  currStudent.skills[i].level = level;
}

async function editStudent(number) {
  edit.value = true;

  const student = await getStudent(number);
  const skills = await getSkills(number);

  currStudent.name = `${student.voornaam} ${student.achternaam}`;
  currStudent.skills = skills;

  ws.send({ type: "get", number });
}
</script>

<template>
  <div class="docent-page">
    <!-- <DocentForm /> -->

    <div class="fade-in">
      <!-- Header -->
      <header class="docent-header">
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
        <h1 class="header-title">DOCENT DASHBOARD</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Main Content -->
      <div class="docent-content">
        <div class="main-container">
          <div class="content-slider" :class="{ 'show-edit': edit }">
            <!-- Student List View -->
            <div class="student-list-section">
              <div class="search-section">
                <h2 class="section-title">Studenten Beheer</h2>
                <div class="search-input-container">
                  <input
                    class="search-input"
                    type="text"
                    placeholder="Zoek student..."
                  />
                </div>
              </div>

              <div class="students-grid">
                <div
                  v-for="student in studenten"
                  :key="student.number"
                  class="student-card"
                >
                  <div class="student-info">
                    <h3 class="student-name">{{ student.name }}</h3>
                    <p class="student-number">{{ student.number }}</p>
                  </div>
                  <button
                    @click="editStudent(student.number)"
                    class="edit-button"
                    aria-label="Bewerk student"
                  >
                    <PencilIcon class="edit-icon" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Student Edit View -->
            <div class="student-edit-section">
              <div class="edit-header">
                <button @click="edit = false" class="back-to-list-button">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="#374151"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <h2 class="edit-title">{{ currStudent.name }}</h2>
              </div>

              <div class="skills-container">
                <div
                  v-for="(skill, i) in currStudent.skills"
                  :key="i"
                  class="skill-item"
                >
                  <h3 class="skill-title">{{ skill.titel }}</h3>
                  <div class="skill-input-wrapper">
                    <NumberInput
                      :length="10"
                      :value="skill.level"
                      @change="(e) => setSkill(i, e)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docent-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.docent-header {
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

.docent-content {
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 70px);
}

.main-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  height: 600px;
  overflow: hidden;
}

.content-slider {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.content-slider.show-edit {
  transform: translateX(-50%);
}

.student-list-section,
.student-edit-section {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.search-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  text-align: center;
}

.search-input-container {
  margin-top: 8px;
}

.search-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.students-grid {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.student-card:hover {
  border-color: #f97316;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.student-number {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.edit-button {
  background: #10b981;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background: #059669;
}

.edit-icon {
  width: 16px;
  height: 16px;
  fill: white;
}

.student-edit-section {
  padding: 24px;
}

.edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-to-list-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-to-list-button:hover {
  background: #f3f4f6;
}

.edit-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  text-align: center;
  flex: 1;
}

.skills-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.skill-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  text-align: center;
}

.skill-input-wrapper {
  display: flex;
  justify-content: center;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-container {
    max-width: 100%;
    height: 70vh;
  }

  .docent-content {
    padding: 16px;
  }

  .student-list-section,
  .student-edit-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .section-title,
  .edit-title {
    font-size: 16px;
  }

  .student-name {
    font-size: 13px;
  }

  .skill-title {
    font-size: 13px;
  }
}
</style>
