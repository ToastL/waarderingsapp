import { createConnectionPool } from "~/server/pool";

export default defineEventHandler(async (event) => {
  try {
    const { s: sessionKey }: { s: string } = getQuery(event);

    if (!sessionKey) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session key required",
      });
    }

    const studentId = event.context.params?.id;

    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Student ID required",
      });
    }

    const db = await createConnectionPool(sessionKey);

    // Try to find by ID first, then by student number
    let query, params;
    if (isNaN(Number(studentId))) {
      // If it's not a number, search by student_number
      query = `
                SELECT 
                    id,
                    student_number,
                    first_name,
                    last_name,
                    email,
                    phone,
                    class_name,
                    image_url,
                    created_at,
                    updated_at
                FROM students 
                WHERE student_number = $1
            `;
      params = [studentId];
    } else {
      // If it's a number, try both ID and student_number
      query = `
                SELECT 
                    id,
                    student_number,
                    first_name,
                    last_name,
                    email,
                    phone,
                    class_name,
                    image_url,
                    created_at,
                    updated_at
                FROM students 
                WHERE id = $1 OR student_number = $2
            `;
      params = [Number(studentId), studentId];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Student not found",
      });
    }

    const student = result.rows[0];

    return {
      id: student.id,
      studentNumber: student.student_number,
      name: `${student.first_name} ${student.last_name}`,
      firstName: student.first_name,
      lastName: student.last_name,
      email: student.email,
      phone: student.phone,
      className: student.class_name,
      image: student.image_url,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    };
  } catch (error: any) {
    console.error("Error fetching student:", error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch student",
    });
  }
});
