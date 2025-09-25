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

    const db = await createConnectionPool(sessionKey);

    const result = await db.query(`
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
            ORDER BY last_name, first_name
        `);

    return result.rows.map((student) => ({
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
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch students",
    });
  }
});
