<script setup>
import { ref, computed } from "vue";

const students = [
  { id: 1, name: "Jorden Gielen", image: "/assets/img/bureau_logo.png" },
  { id: 2, name: "Student 2", image: "/assets/img/bureau_logo.png" },
  { id: 3, name: "Student 3", image: "/assets/img/bureau_logo.png" },
  { id: 4, name: "Student 4", image: "/assets/img/bureau_logo.png" },
  { id: 5, name: "Student 5", image: "/assets/img/bureau_logo.png" },
  { id: 6, name: "Student 6", image: "/assets/img/bureau_logo.png" },
  { id: 7, name: "Student 7", image: "/assets/img/bureau_logo.png" },
];

const selectedStudent = ref(null);
const reviewSubmitted = ref(false);
const searchQuery = ref("");

// Add categories and ratings state
const categories = [
  "Presenteren",
  "Organiseren",
  "Zelfstandigheid",
  "Samenwerken",
  "Communiceren",
];
const ratings = ref({
  Presenteren: 0,
  Organiseren: 0,
  Zelfstandigheid: 0,
  Samenwerken: 0,
  Communiceren: 0,
});
const reviewText = ref("");

// Filtered students based on search query
const filteredStudents = computed(() =>
  students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Function to handle student selection
const selectStudent = (student) => {
  selectedStudent.value = student;
  reviewSubmitted.value = false;
  // Reset ratings and review text on new selection
  categories.forEach((cat) => (ratings.value[cat] = 0));
  reviewText.value = "";
};

// Function to handle review submission
const submitReview = () => {
  // You can use ratings.value and reviewText.value here for saving/submitting
  reviewSubmitted.value = true;
};
</script>

<template>
  <div class="review-flow">
    <button
      class="text-white text-3xl mb-4 focus:outline-none hover:text-gray-200 transition"
      @click="selectedStudent = null"
      aria-label="Terug"
      style="background: none; border: none; padding: 0"
    >
      ←
    </button>
    <!-- Step 1: Reviewer Dashboard -->
    <div v-if="!selectedStudent" class="fade-in">
      <h2 class="text-center text-2xl font-bold text-white bg-orange-500 py-4">
        REVIEW FORUM
      </h2>
      <div class="search-bar mt-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Zoek naar student"
          class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="student-card"
          @click="selectStudent(student)"
        >
          <img
            :src="student.image"
            alt="Student"
            class="rounded-full w-24 h-24 mx-auto shadow-lg"
          />
          <p class="text-center mt-2 font-medium text-gray-700">
            {{ student.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- Step 2: Review Form -->
    <!-- Step 2: Review Form -->
    <div v-else-if="!reviewSubmitted" class="fade-in">
      <!-- <button
        class="text-white text-3xl mb-4 focus:outline-none hover:text-gray-200 transition"
        @click="selectedStudent = null"
        aria-label="Terug"
        style="background: none; border: none; padding: 0"
      >
        ←
      </button> -->
      <div
        class="review-header flex items-center bg-orange-500 py-4 px-4 rounded-t-[12px]"
      >
        <h2 class="flex-1 text-center text-2xl font-bold text-white m-0">
          REVIEW FORUM
        </h2>
        <span class="w-8"></span>
      </div>
      <p class="text-center mt-4 text-gray-700">
        Student geselecteerd:
        <strong class="text-orange-600">{{ selectedStudent.name }}</strong>
      </p>
      <div class="review-form mt-6">
        <p class="text-lg font-medium text-gray-700">
          Wat was je ervaring met {{ selectedStudent.name }}?
        </p>
        <div class="rating-grid grid grid-cols-2 gap-4 mt-4">
          <div v-for="category in categories" :key="category">
            <p class="font-medium text-gray-600">{{ category }}</p>
            <div class="stars flex">
              <svg
                v-for="i in 5"
                :key="i"
                @click="ratings[category] = i"
                @mouseover="ratings[category + '_hover'] = i"
                @mouseleave="ratings[category + '_hover'] = 0"
                :class="[
                  'star',
                  (
                    ratings[category + '_hover']
                      ? i <= ratings[category + '_hover']
                      : i <= ratings[category]
                  )
                    ? 'star-filled'
                    : 'star-empty',
                ]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="28"
                height="28"
                style="cursor: pointer; transition: transform 0.2s"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"
                />
              </svg>
            </div>
          </div>
        </div>
        <textarea
          v-model="reviewText"
          class="w-full mt-6 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Laat een berichtje achter"
        ></textarea>
        <button
          class="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-all"
          @click="submitReview"
        >
          Verstuur
        </button>
      </div>
    </div>

    <!-- Step 3: Review Confirmation -->
    <div v-else class="fade-in">
      <h2 class="text-center text-2xl font-bold text-white bg-orange-500 py-4">
        REVIEW FORUM
      </h2>
      <div class="confirmation mt-6 text-center">
        <img
          src="/assets/img/bureau_logo.png"
          alt="Logo"
          class="mx-auto w-24 h-24 rounded-full shadow-lg"
        />
        <p class="mt-6 text-lg font-medium text-gray-700">
          👍 Bedankt voor jouw review
        </p>
        <p class="text-gray-600">We zien je graag nog een keer langs komen</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-flow {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  background: url("/assets/img/docent_preload.png") no-repeat center center;
  background-size: cover;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  min-height: 100vh;
  box-sizing: border-box;
  /* Prevent horizontal scroll */
  overflow-x: hidden;
}

.review-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  align-items: center;
  min-height: 56px;
}

.search-bar input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.student-card {
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff;
}

.student-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rating-grid .stars .star {
  margin-right: 4px;
  transition: transform 0.2s;
}

.star {
  margin-right: 4px;
  color: #fbbf24; /* Tailwind yellow-400 */
  cursor: pointer;
}
.star-empty {
  color: #e5e7eb; /* Tailwind gray-200 */
}
.star-filled {
  color: #fbbf24; /* Tailwind yellow-400 */
}
.star:last-child {
  margin-right: 0;
}

textarea {
  resize: none;
}

button {
  width: 100%;
}

.confirmation img {
  border-radius: 50%;
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

.fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 10;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .student-card {
    padding: 8px;
  }
}
</style>
