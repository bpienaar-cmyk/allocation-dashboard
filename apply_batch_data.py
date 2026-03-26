#!/usr/bin/env python3
"""
Apply Batch 2-5 data to dashboardData.ts using targeted find-and-replace.
"""

import json
import re
from pathlib import Path

# File paths
data_file = Path("/sessions/admiring-modest-clarke/alloc-dash-refresh/src/data/dashboardData.ts")

# Q8: trendsByCategoryAndCountry data
q8_data_uk = {
    "furniture": [
        {"month": "2025-01-01", "jobs": 18580, "ttv": 2645196.00, "avFee": 1297909.60, "marginPct": 48.95, "allocSpend": 17093.26, "spendTtvPct": 0.65, "otdCancels": 142, "tpCancels": 38, "cantSourceCount": 12, "otdDeallocations": 1206, "adminAllocD1Otd": 0, "totalRecords": 20400},
        {"month": "2025-02-01", "jobs": 19346, "ttv": 2733258.00, "avFee": 1335790.50, "marginPct": 48.85, "allocSpend": 16265.64, "spendTtvPct": 0.59, "otdCancels": 173, "tpCancels": 62, "cantSourceCount": 9, "otdDeallocations": 1187, "adminAllocD1Otd": 0, "totalRecords": 21258},
        {"month": "2025-03-01", "jobs": 22681, "ttv": 3335054.00, "avFee": 1659837.88, "marginPct": 49.75, "allocSpend": 41946.28, "spendTtvPct": 1.26, "otdCancels": 205, "tpCancels": 65, "cantSourceCount": 26, "otdDeallocations": 1338, "adminAllocD1Otd": 0, "totalRecords": 25146},
    ],
    "homeRemoval": [
        {"month": "2025-01-01", "jobs": 3299, "ttv": 2318004.00, "avFee": 1226545.00, "marginPct": 52.88, "allocSpend": 6278.64, "spendTtvPct": 0.27, "otdCancels": 14, "tpCancels": 5, "cantSourceCount": 2, "otdDeallocations": 101, "adminAllocD1Otd": 0, "totalRecords": 4080},
        {"month": "2025-02-01", "jobs": 3702, "ttv": 2478522.70, "avFee": 1300795.70, "marginPct": 52.42, "allocSpend": 10349.45, "spendTtvPct": 0.42, "otdCancels": 26, "tpCancels": 11, "cantSourceCount": 3, "otdDeallocations": 126, "adminAllocD1Otd": 0, "totalRecords": 4532},
        {"month": "2025-03-01", "jobs": 4905, "ttv": 3920221.00, "avFee": 2243329.00, "marginPct": 57.17, "allocSpend": 34362.04, "spendTtvPct": 0.88, "otdCancels": 25, "tpCancels": 11, "cantSourceCount": 4, "otdDeallocations": 155, "adminAllocD1Otd": 0, "totalRecords": 6198},
    ],
    "car": [
        {"month": "2025-01-01", "jobs": 2233, "ttv": 499351.00, "avFee": 107926.00, "marginPct": 21.61, "allocSpend": 11027.40, "spendTtvPct": 2.21, "otdCancels": 39, "tpCancels": 3, "cantSourceCount": 12, "otdDeallocations": 107, "adminAllocD1Otd": 0, "totalRecords": 2543},
        {"month": "2025-02-01", "jobs": 2472, "ttv": 529880.00, "avFee": 110711.00, "marginPct": 20.89, "allocSpend": 12379.27, "spendTtvPct": 2.34, "otdCancels": 42, "tpCancels": 6, "cantSourceCount": 14, "otdDeallocations": 115, "adminAllocD1Otd": 0, "totalRecords": 2817},
        {"month": "2025-03-01", "jobs": 2429, "ttv": 617063.00, "avFee": 135156.00, "marginPct": 21.92, "allocSpend": 26020.73, "spendTtvPct": 4.22, "otdCancels": 45, "tpCancels": 3, "cantSourceCount": 17, "otdDeallocations": 95, "adminAllocD1Otd": 0, "totalRecords": 2801},
    ],
    "motorbike": [
        {"month": "2025-01-01", "jobs": 161, "ttv": 29256.00, "avFee": 6429.00, "marginPct": 21.96, "allocSpend": 401.00, "spendTtvPct": 1.37, "otdCancels": 3, "tpCancels": 0, "cantSourceCount": 0, "otdDeallocations": 16, "adminAllocD1Otd": 0, "totalRecords": 186},
    ],
    "piano": [
        {"month": "2025-01-01", "jobs": 129, "ttv": 37874.00, "avFee": 19094.00, "marginPct": 50.38, "allocSpend": 1645.16, "spendTtvPct": 4.34, "otdCancels": 2, "tpCancels": 1, "cantSourceCount": 1, "otdDeallocations": 10, "adminAllocD1Otd": 0, "totalRecords": 155},
    ]
}

print("Batch 2-5 data structure ready for application...")
print(f"Sample Q8 data for Furniture 2025-01: {q8_data_uk['furniture'][0]}")

