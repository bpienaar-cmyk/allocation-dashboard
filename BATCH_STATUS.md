# Dashboard Data Refresh Status

## Batch 1 - Overview Data ✓ COMPLETE
- Status: Successfully applied
- Build status: npm run build ✓ PASSED
- Covers: overviewByCountry (UK, Spain, France) for MTD CY/PY

## Batch 2 - Category & Daily Detail (Q8-Q14) - IN PROGRESS
- Q8: trendsByCategoryAndCountry - Data extracted ✓
  - UK: 5 categories × 14 months = 70 data points
  - Ready for application
  
- Q9: categoryBreakdownByCountry - Data extracted ✓
  - UK: ~850+ rows (category × NUTS1 × month)
  - Ready for application
  
- Q10: activeBookingsByCountry - Pending
  - Requires: day × NUTS1 × category × status breakdown
  
- Q11: dailyOverviewByCountry - Pending
  - Requires: daily × category MTD CY+PY
  
- Q12: furnRoutingByCountry - Pending
  - Requires: daily routing metrics
  
- Q13: tpCancelsByCountry - Pending
  - Requires: daily TP cancel counts
  
- Q14: partialMonthComparisonByCountry - Pending
  - Requires: current vs prior month comparison

## Batch 3 - Spend Analysis (Q15-Q18) - PENDING
- Q15: spendByNutsByCountry
- Q16: spendByCategoryByCountry
- Q17: spendByDaysByCountry
- Q18: agentSpendByCountry

## Batch 4 - Raw Data & Trends (Q19-Q23) - PENDING
- Q19: mtdRaw2025/mtdRaw2026
- Q20: cancellationRawByCountry
- Q21: completedPaidRawByCountry
- Q22: monthlyCancellationTrendsByCountry
- Q23: monthlyCompletedPaidTrendsByCountry

## Batch 5 - iRes (Q24-Q25) - PENDING
- Q24: iresReservationData
- Q25: iresTrendData

## Next Steps
1. Complete Q8-Q14 queries (Batch 2)
2. Run Q15-Q18 queries (Batch 3)
3. Run Q19-Q23 queries (Batch 4)
4. Run Q24-Q25 queries (Batch 5)
5. Apply all data with find-and-replace script
6. Run final build and push to main
