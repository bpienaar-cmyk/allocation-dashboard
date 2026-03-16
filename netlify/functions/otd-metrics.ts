import type { Handler } from "@netlify/functions";
import { executeQuery } from "./shared/snowflakeClient";
import {
  OTD_ALLOC_SPEND_SQL,
  OTD_NO_SPEND_SQL,
} from "./shared/queries";

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

    // Execute both OTD queries in parallel
    const [otdAllocSpend, otdNoSpend] = await Promise.all([
      executeQuery(OTD_ALLOC_SPEND_SQL, [startDate, endDate]),
      executeQuery(OTD_NO_SPEND_SQL, [startDate, endDate]),
    ]);

    const data = {
      period: {
        startDate,
        endDate,
      },
      allocSpend: otdAllocSpend[0] || {},
      noSpend: otdNoSpend[0] || {},
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in otd-metrics function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
