import sql from "@/app/lib/db";

export async function insertNewUrl(data: any) {
  const { targetUrl, shortCode } = data;
  try {
    await sql`INSERT INTO urls (code, target) VALUES (${shortCode}, ${targetUrl})`;
    return {
      success: true,
      status: 200,
      response: { code: shortCode, target: targetUrl },
    };
  } catch (error) {
    return {
      success: false,
      status: 409,
      response: "duplicate shortcode",
    };
  }
}
export async function getAllUrls() {
  const response = await sql`SELECT code, target FROM urls`;
  return response;
}
export async function incrementClicks(shortCode: string) {
  const response = await sql`
    UPDATE urls
    SET clicks = clicks + 1, last_clicked = NOW()
    WHERE code=${shortCode}
    RETURNING target
    `;
  return response;
}
export async function getStatsByCode(shortCode: string) {
  const response = await sql`SELECT * FROM urls WHERE code=${shortCode}`;
  return response;
}

export async function deleteUrlByCode(shortCode: string) {
  try {
    const result = await sql`
      DELETE FROM urls
      WHERE code = ${shortCode}
      RETURNING code
    `;

    if (result.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Short code not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting URL:", error);

    return {
      success: false,
      status: 500,
      message: "Database error while deleting URL",
      details: error.message,
    };
  }
}
