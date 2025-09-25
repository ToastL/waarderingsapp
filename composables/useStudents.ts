import { ref, computed } from "vue";
import { session } from "~/assets/js/sessionKey";

export interface Student {
  id: number;
  studentNumber: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  className?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentReview {
  id?: number;
  studentId: number;
  reviewerType: string;
  reviewerId: string;
  ratings: Record<string, number>;
  reviewText: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface StudentSkill {
  id: number;
  name: string;
  description?: string;
  category?: string;
  level?: number;
  assessedAt?: string;
}

export const useStudents = () => {
  const students = ref<Student[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get session key from the existing session utility
  const getSessionKey = () => {
    // Ensure session key is set (only on client side)
    if (typeof window !== "undefined") {
      if (!session.key) {
        session.setKey();
      }
      return session.key;
    }

    return "default-session-key";
  };

  const fetchStudents = async (): Promise<Student[]> => {
    loading.value = true;
    error.value = null;

    try {
      const sessionKey = getSessionKey();
      const data = await $fetch<Student[]>(`/api/student?s=${sessionKey}`);
      students.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch students";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchStudent = async (id: string | number): Promise<Student> => {
    loading.value = true;
    error.value = null;

    try {
      const sessionKey = getSessionKey();
      const student = await $fetch<Student>(
        `/api/student/${id}?s=${sessionKey}`
      );
      return student;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch student";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchStudentReviews = async (
    studentId: number
  ): Promise<StudentReview[]> => {
    try {
      const sessionKey = getSessionKey();
      const reviews = await $fetch<StudentReview[]>(
        `/api/student/${studentId}/reviews?s=${sessionKey}`
      );
      return reviews;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch student reviews";
      throw err;
    }
  };

  const submitReview = async (
    studentId: number,
    reviewData: Omit<
      StudentReview,
      "id" | "studentId" | "submittedAt" | "updatedAt"
    >
  ): Promise<{ id: number; submittedAt: string }> => {
    try {
      const sessionKey = getSessionKey();
      const result = await $fetch<{ id: number; submittedAt: string }>(
        `/api/student/${studentId}/reviews?s=${sessionKey}`,
        {
          method: "POST",
          body: reviewData,
        }
      );
      return result;
    } catch (err: any) {
      error.value = err.message || "Failed to submit review";
      throw err;
    }
  };

  const fetchStudentSkills = async (
    studentId: number
  ): Promise<StudentSkill[]> => {
    try {
      const sessionKey = getSessionKey();
      const skills = await $fetch<StudentSkill[]>(
        `/api/student/${studentId}/skills?s=${sessionKey}`
      );
      return skills;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch student skills";
      throw err;
    }
  };

  const updateStudentSkill = async (
    studentId: number,
    skillId: number,
    level: number
  ): Promise<{ id: number; assessedAt: string }> => {
    try {
      const sessionKey = getSessionKey();
      const result = await $fetch<{ id: number; assessedAt: string }>(
        `/api/student/${studentId}/skills?s=${sessionKey}`,
        {
          method: "POST",
          body: { skillId, level },
        }
      );
      return result;
    } catch (err: any) {
      error.value = err.message || "Failed to update student skill";
      throw err;
    }
  };

  // Computed properties
  const studentsCount = computed(() => students.value.length);

  const studentsByClass = computed(() => {
    return students.value.reduce((acc, student) => {
      const className = student.className || "Unknown";
      if (!acc[className]) acc[className] = [];
      acc[className].push(student);
      return acc;
    }, {} as Record<string, Student[]>);
  });

  // Helper methods
  const findStudentById = (id: number): Student | undefined => {
    return students.value.find((student) => student.id === id);
  };

  const findStudentByNumber = (studentNumber: string): Student | undefined => {
    return students.value.find(
      (student) => student.studentNumber === studentNumber
    );
  };

  const searchStudents = (query: string): Student[] => {
    if (!query) return students.value;

    const lowercaseQuery = query.toLowerCase();
    return students.value.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercaseQuery) ||
        student.studentNumber.toLowerCase().includes(lowercaseQuery) ||
        (student.email &&
          student.email.toLowerCase().includes(lowercaseQuery)) ||
        (student.className &&
          student.className.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    // State
    students: readonly(students),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    fetchStudents,
    fetchStudent,
    fetchStudentReviews,
    submitReview,
    fetchStudentSkills,
    updateStudentSkill,

    // Computed
    studentsCount,
    studentsByClass,

    // Helpers
    findStudentById,
    findStudentByNumber,
    searchStudents,
  };
};
