<script setup>
import { ref, computed, onMounted } from "vue";

const { students, loading, error, fetchStudents, searchStudents } =
  useStudents();
const selectedStudent = ref(null);
const reviewSubmitted = ref(false);
const searchQuery = ref("");

// Fetch students when component mounts
onMounted(async () => {
  try {
    await fetchStudents();
  } catch (err) {
    console.error("Error loading students:", err);
  }
});

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

// Filtered students based on search query (searches both name and student number)
const filteredStudents = computed(() => {
  return searchStudents(searchQuery.value);
});

// Function to handle student selection
const selectStudent = async (student) => {
  // Navigate to the review page with student data using router
  await navigateTo({
    path: "/review",
    query: {
      studentId: String(student.id),
    },
  });
};

// Function to handle review submission
const submitReview = () => {
  // You can use ratings.value and reviewText.value here for saving/submitting
  reviewSubmitted.value = true;
};
</script>

<template>
  <div class="review-page">
    <!-- Step 1: Student Selection -->
    <div v-if="!selectedStudent" class="fade-in">
      <!-- Header -->
      <header class="review-header">
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
        <h1 class="header-title">REVIEW FORUM</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Main Content -->
      <div class="review-content">
        <!-- Student Selection Form -->
        <div class="student-selection-form">
          <h2 class="form-question">Selecteer een student om te beoordelen</h2>

          <!-- Search Bar -->
          <div class="search-section">
            <label class="search-label">Zoek naar student</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Typ een naam of studentnummer..."
              class="search-input"
            />
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">Students aan het laden...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <p class="text-red-600 text-lg">{{ error }}</p>
            <button
              @click="fetchStudents()"
              class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Opnieuw proberen
            </button>
          </div>

          <!-- Student Grid -->
          <div v-else class="student-grid">
            <div
              v-for="student in filteredStudents"
              :key="student.id"
              class="student-card"
              @click="selectStudent(student)"
            >
              <img
                :src="student.image || '/assets/img/bureau_logo.png'"
                alt="Student"
                class="student-image"
              />
              <p class="student-name">{{ student.name }}</p>
              <p class="student-number">{{ student.studentNumber }}</p>
            </div>

            <!-- No students found -->
            <div
              v-if="filteredStudents.length === 0"
              class="col-span-full text-center py-8"
            >
              <p class="text-gray-600">Geen studenten gevonden</p>
              <p v-if="searchQuery" class="text-sm text-gray-500 mt-2">
                Probeer een andere zoekopdracht
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Step 2: Review Form -->
    <div v-else-if="!reviewSubmitted" class="fade-in">
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
.review-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.review-header {
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

.review-content {
  padding: 24px 20px;
}

.student-selection-form {
  background: white;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-question {
  font-size: 16px;
  color: #374151;
  margin: 0 0 32px 0;
  font-weight: 500;
  text-align: center;
}

.search-section {
  margin-bottom: 32px;
}

.search-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
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

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.student-card {
  cursor: pointer;
  text-align: center;
  border: 1px solid #e5e7eb;
  padding: 16px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: #fff;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #f97316;
}

.student-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 12px auto;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.student-number {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
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
@media (max-width: 480px) {
  .review-content {
    padding: 20px 16px;
  }

  .student-selection-form {
    padding: 20px 16px;
  }

  .student-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .form-question {
    font-size: 14px;
  }

  .student-image {
    width: 50px;
    height: 50px;
  }

  .student-name {
    font-size: 12px;
  }

  .student-number {
    font-size: 10px;
  }
}
</style>
