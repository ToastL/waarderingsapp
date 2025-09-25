import { createConnectionPool } from "~/server/pool";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

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

    if (method === "GET") {
      // Get all reviews for a student
      const result = await db.query(
        `
                SELECT 
                    id,
                    student_id,
                    reviewer_type,
                    reviewer_id,
                    ratings,
                    review_text,
                    submitted_at,
                    updated_at
                FROM student_reviews 
                WHERE student_id = $1
                ORDER BY submitted_at DESC
            `,
        [Number(studentId)]
      );

      return result.rows.map((review) => ({
        id: review.id,
        studentId: review.student_id,
        reviewerType: review.reviewer_type,
        reviewerId: review.reviewer_id,
        ratings: review.ratings,
        reviewText: review.review_text,
        submittedAt: review.submitted_at,
        updatedAt: review.updated_at,
      }));
    }

    if (method === "POST") {
      // Create a new review
      const body = await readBody(event);
      const {
        ratings,
        reviewText,
        reviewerType = "klant",
        reviewerId = "anonymous",
      } = body;

      if (!ratings || typeof ratings !== "object") {
        throw createError({
          statusCode: 400,
          statusMessage: "Ratings are required and must be an object",
        });
      }

      const result = await db.query(
        `
                INSERT INTO student_reviews (student_id, reviewer_type, reviewer_id, ratings, review_text)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, submitted_at
            `,
        [
          Number(studentId),
          reviewerType,
          reviewerId,
          JSON.stringify(ratings),
          reviewText || "",
        ]
      );

      return {
        id: result.rows[0].id,
        submittedAt: result.rows[0].submitted_at,
        message: "Review submitted successfully",
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  } catch (error: any) {
    console.error("Error handling student review:", error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to handle student review",
    });
  }
});
