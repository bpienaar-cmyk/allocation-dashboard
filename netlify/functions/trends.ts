import type { Handler } from "@netlify/functions";
import { executeQuery } from "./shared/snowflakeClient";
import { TRENDS_SQL } from "./shared/queries";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler: Handler = async (event) => {
  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    let endDate = queryParams.endDate;

    // Default to today if not provided
    if (!endDate) {
      const now = new Date();
      endDate = now.toISOString().split("T")[0];
    }

    // Execute TRENDS_SQL query with endDate passed twice as per query definition
    const trends = await executeQuery(TRENDS_SQL, [endDate, endDate]);

    // Transform results to include formatted period
    const formattedTrends = trends.map((row: any) => ({
      ...row,
      period: row.period ? new Date(row.period).toISOString().split("T")[0] : null,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: formattedTrends,
        endDate,
      }),
    };
  } catch (error) {
    console.error("Error in trends function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
