import type { Handler } from "@netlify/functions";
import { executeQuery } from "./shared/snowflakeClient";
import { REGIONAL_BREAKDOWN_SQL } from "./shared/queries";

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
    let startDate = queryParams.startDate;
    let endDate = queryParams.endDate;

    // Default to last 90 days if not provided
    if (!startDate || !endDate) {
      const now = new Date();
      endDate = now.toISOString().split("T")[0];

      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      startDate = ninetyDaysAgo.toISOString().split("T")[0];
    }

    // Execute regional breakdown query
    const regions = await executeQuery(REGIONAL_BREAKDOWN_SQL, [startDate, endDate]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: regions,
        period: {
          startDate,
          endDate,
        },
      }),
    };
  } catch (error) {
    console.error("Error in regional-breakdown function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
