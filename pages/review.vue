<script setup>
import { ref, watch, computed, onMounted } from "vue";

const route = useRoute();

// Get student data from route params - make it reactive
const selectedStudent = computed(() => {
  const studentId = route.query.studentId;
  const studentName = route.query.studentName;

  // Ensure we have valid data
  if (!studentId || !studentName) {
    console.warn("Missing route parameters:", { studentId, studentName });
  }

  return {
    id: studentId || "1",
    name: studentName || "Unknown Student",
  };
});

const showSuccessModal = ref(false);

// Rating categories as shown in the mockup
const categories = [
  "Presenteren",
  "Organiseren",
  "Zelfstandigheid",
  "Samenwerken",
  "Communiceren",
];

// Function to get stored data for a student
const getStudentData = (studentId) => {
  if (process.client) {
    const stored = localStorage.getItem(`student-review-${studentId}`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Function to save student data
const saveStudentData = (studentId, data) => {
  if (process.client) {
    localStorage.setItem(`student-review-${studentId}`, JSON.stringify(data));
  }
};

// Create reactive ratings and review text that auto-load per student
const ratings = ref({
  Presenteren: 0,
  Organiseren: 0,
  Zelfstandigheid: 0,
  Samenwerken: 0,
  Communiceren: 0,
});

const reviewText = ref("");

// Function to load student data
const loadStudentData = (studentId) => {
  const storedData = getStudentData(studentId);

  if (storedData) {
    // Load existing data for this student
    ratings.value = { ...storedData.ratings };
    reviewText.value = storedData.reviewText || "";
  } else {
    // Initialize with empty ratings for new student
    ratings.value = {
      Presenteren: 0,
      Organiseren: 0,
      Zelfstandigheid: 0,
      Samenwerken: 0,
      Communiceren: 0,
    };
    reviewText.value = "";
  }
};

// Load data when component mounts
onMounted(() => {
  if (selectedStudent.value.id) {
    loadStudentData(selectedStudent.value.id);
  }
});

// Check if this student's review has been submitted
const isReviewSubmitted = computed(() => {
  const storedData = getStudentData(selectedStudent.value.id);
  return storedData?.submitted || false;
});

// Watch for route changes to reinitialize data if student changes
watch(
  () => route.query.studentId,
  (newStudentId, oldStudentId) => {
    if (newStudentId !== oldStudentId && newStudentId) {
      // Load data for the new student
      loadStudentData(newStudentId);

      // Reset modal
      showSuccessModal.value = false;
    }
  },
  { immediate: true }
);

// Function to set rating for a category
const setRating = (category, rating) => {
  ratings.value[category] = rating;
  // Save data immediately when rating changes
  saveStudentData(selectedStudent.value.id, {
    ratings: ratings.value,
    reviewText: reviewText.value,
    lastUpdated: new Date().toISOString(),
  });
};

// Watch for changes in review text and save automatically
watch(reviewText, (newText) => {
  saveStudentData(selectedStudent.value.id, {
    ratings: ratings.value,
    reviewText: newText,
    lastUpdated: new Date().toISOString(),
  });
});

// Function to handle form submission
const submitReview = () => {
  // Save final data with submission timestamp
  const submissionData = {
    ratings: ratings.value,
    reviewText: reviewText.value,
    submitted: true,
    submittedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  saveStudentData(selectedStudent.value.id, submissionData);

  // Here you would typically send the data to an API
  console.log("Review submitted:", {
    student: selectedStudent.value,
    ratings: ratings.value,
    comment: reviewText.value,
  });

  showSuccessModal.value = true;
};

// Function to go back
const goBack = () => {
  // Navigate back to the klant page
  navigateTo("/klant");
};

// Function to close modal and potentially navigate away
const closeModal = () => {
  showSuccessModal.value = false;
  // You could navigate to another page here if needed
};
</script>

<template>
  <div class="review-page">
    <!-- Header -->
    <header class="review-header">
      <button @click="goBack" class="back-button" aria-label="Terug">
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
      <!-- Student Selection Display -->
      <div class="student-info">
        <span class="student-label">Student geselecteerd</span>
        <span class="student-name">{{ selectedStudent.name }}</span>
      </div>

      <!-- Review Form -->
      <div class="review-form">
        <h2 class="form-question">
          Wat was je ervaring met {{ selectedStudent.name }} ?
        </h2>

        <!-- Submission Status Indicator -->
        <div v-if="isReviewSubmitted" class="submission-status">
          <span class="status-icon">✅</span>
          <span class="status-text">Review reeds ingediend</span>
        </div>

        <!-- Rating Categories -->
        <div class="rating-categories">
          <div
            v-for="category in categories"
            :key="category"
            class="rating-row"
          >
            <label class="category-label">{{ category }}</label>
            <div class="rating-circles">
              <button
                v-for="i in 5"
                :key="i"
                @click="setRating(category, i)"
                :class="[
                  'rating-circle',
                  i <= ratings[category] ? 'filled' : 'empty',
                ]"
                :aria-label="`Rate ${category} ${i} out of 5`"
              />
            </div>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="comment-section">
          <label class="comment-label">Laat een berichtje achter</label>
          <textarea
            v-model="reviewText"
            class="comment-textarea"
            rows="6"
            placeholder=""
          />
        </div>

        <!-- Submit Button -->
        <button @click="submitReview" class="submit-button">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="success-modal" @click.stop>
        <div class="modal-content">
          <div class="logo-container">
            <div class="logo-circle">
              <div class="logo-text">
                <div class="het">HET</div>
                <div class="bureau">BUR<br />EAU</div>
              </div>
            </div>
          </div>
          <div class="success-message">
            <div class="success-icon">👍</div>
            <div class="success-title">Bedankt voor jou review</div>
            <div class="success-subtitle">
              we zien je graag nog een keer<br />langs komen
            </div>
          </div>
        </div>
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

.student-info {
  text-align: center;
  margin-bottom: 32px;
}

.student-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 4px;
}

.student-name {
  display: block;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.review-form {
  background: white;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-question {
  font-size: 16px;
  color: #374151;
  margin: 0 0 32px 0;
  font-weight: 500;
  text-align: center;
}

.submission-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 24px;
}

.status-icon {
  font-size: 16px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #065f46;
}

.rating-categories {
  margin-bottom: 32px;
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 8px 0;
}

.rating-row:last-child {
  margin-bottom: 0;
}

.category-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.rating-circles {
  display: flex;
  gap: 8px;
}

.rating-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.rating-circle.filled {
  background: #f97316;
}

.rating-circle.empty {
  background: transparent;
  border: 2px solid #d1d5db;
}

.rating-circle:hover {
  transform: scale(1.1);
}

.comment-section {
  margin-bottom: 32px;
}

.comment-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.comment-textarea {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
}

.comment-textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.submit-button {
  position: absolute;
  bottom: -28px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: #f97316;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  transition: all 0.2s ease;
}

.submit-button:hover {
  background: #ea580c;
  transform: scale(1.05);
}

.submit-button:active {
  transform: scale(0.95);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.success-modal {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.logo-container {
  margin-bottom: 24px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: #1f2937;
  border-radius: 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 1;
}

.het {
  font-size: 14px;
  margin-bottom: 2px;
}

.bureau {
  font-size: 12px;
  line-height: 1.1;
}

.success-message {
  color: #374151;
}

.success-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.success-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.success-subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .review-content {
    padding: 20px 16px;
  }

  .review-form {
    padding: 20px 16px;
  }

  .rating-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .rating-circles {
    align-self: stretch;
    justify-content: flex-end;
  }

  .form-question {
    font-size: 14px;
  }

  .category-label {
    font-size: 14px;
  }
}
</style>
