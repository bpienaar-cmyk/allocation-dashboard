import type { Handler } from "@netlify/functions";
import { executeQuery } from "./shared/snowflakeClient";
import {
  CORE_METRICS_SQL,
  CANCELLATIONS_SQL,
  DEALLOCATIONS_SQL,
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

    // Execute all queries in parallel
    const [coreMetrics, cancellations, deallocations, otdAllocSpend, otdNoSpend] = await Promise.all([
      executeQuery(CORE_METRICS_SQL, [startDate, endDate]),
      executeQuery(CANCELLATIONS_SQL, [startDate, endDate]),
      executeQuery(DEALLOCATIONS_SQL, [startDate, endDate]),
      executeQuery(OTD_ALLOC_SPEND_SQL, [startDate, endDate]),
      executeQuery(OTD_NO_SPEND_SQL, [startDate, endDate]),
    ]);

    const data = {
      period: {
        startDate,
        endDate,
      },
      coreMetrics: coreMetrics[0] || {},
      cancellations: cancellations[0] || {},
      deallocations: deallocations[0] || {},
      otdMetrics: {
        allocSpend: otdAllocSpend[0] || {},
        noSpend: otdNoSpend[0] || {},
      },
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in overview function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
