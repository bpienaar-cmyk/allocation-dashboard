import {
  OverviewData,
  TrendPoint,
  CategoryRow,
  RegionRow,
  OtdMetrics,
  DeallocationData,
  Country,
  CountryOverview,
  DailyRaw,
  CategoryType,
  CategoryBreakdownRow,
  ActiveBookingRow,
  DailyOverviewRow,
  IResReservationRow,
  IResTrendRow,
  SpendNutsRow,
  SpendCategoryRow,
  SpendByDaysRow,
  AgentSpendRow,
  MtdSpendRawRow,
  CancellationRawRow,
  CompletedPaidRawRow,
  MonthlyCancellationRow,
  MonthlyCompletedPaidRow,
} from '../types/index';

export const DATA_LAST_UPDATED = '2026-03-19T10:00:00Z';

export const REASON_CODE_LABELS: Record<string, string> = {};

/**
 * Overview data by country — MTD March 2026 vs MTD March 2025
 */
export const overviewByCountry: Record<Country, CountryOverview> = {
  uk: {
    current: {
          jobs: 15404,
          ttv: 3608524.76,
          avgTtv: 234.26,
          avFee: 1767802.3,
          marginPct: 48.99,
          allocSpend: 55085.02,
          spendTtvPct: 1.53,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 72.95345802522836,
          tpCancelRate: 0,
        },
    priorYear: {
          jobs: 14156,
          ttv: 3289345.43,
          avgTtv: 232.34,
          avFee: 1512456.78,
          marginPct: 45.95,
          allocSpend: 38234.56,
          spendTtvPct: 1.16,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 72.95345802522836,
          tpCancelRate: 0,
        },
    dailyCY: [
      { day: 1, jobs: 858, ttv: 163668.48, avFee: 85110.32, allocSpend: 3060.09, cantSource: 7, tpCancels: 11, otdDealloCount: 77, furnRouted: 590, furnTotal: 757 },
      { day: 2, jobs: 1128, ttv: 276566.96, avFee: 135807.44, allocSpend: 3890.94, cantSource: 0, tpCancels: 6, otdDealloCount: 114, furnRouted: 704, furnTotal: 865 },
      { day: 3, jobs: 850, ttv: 175373.82, avFee: 78236.28, allocSpend: 4220.21, cantSource: 2, tpCancels: 7, otdDealloCount: 79, furnRouted: 522, furnTotal: 663 },
      { day: 4, jobs: 815, ttv: 183139.64, avFee: 83710.45, allocSpend: 3165.08, cantSource: 3, tpCancels: 6, otdDealloCount: 70, furnRouted: 485, furnTotal: 625 },
      { day: 5, jobs: 937, ttv: 226941.16, avFee: 108259.29, allocSpend: 3450.18, cantSource: 4, tpCancels: 5, otdDealloCount: 65, furnRouted: 559, furnTotal: 707 },
      { day: 6, jobs: 999, ttv: 307439.42, avFee: 158267.49, allocSpend: 5266.14, cantSource: 6, tpCancels: 11, otdDealloCount: 76, furnRouted: 556, furnTotal: 699 },
      { day: 7, jobs: 943, ttv: 223852.65, avFee: 126163.82, allocSpend: 1526.56, cantSource: 3, tpCancels: 6, otdDealloCount: 47, furnRouted: 626, furnTotal: 775 },
      { day: 8, jobs: 528, ttv: 100728.94, avFee: 52569.53, allocSpend: 1346.98, cantSource: 1, tpCancels: 4, otdDealloCount: 51, furnRouted: 363, furnTotal: 474 },
      { day: 9, jobs: 938, ttv: 208297.02, avFee: 97220.23, allocSpend: 3536.73, cantSource: 3, tpCancels: 6, otdDealloCount: 75, furnRouted: 589, furnTotal: 719 },
      { day: 10, jobs: 784, ttv: 163603.27, avFee: 74234.75, allocSpend: 3615.17, cantSource: 4, tpCancels: 6, otdDealloCount: 70, furnRouted: 497, furnTotal: 603 },
      { day: 11, jobs: 760, ttv: 173754.54, avFee: 80311.76, allocSpend: 2542.41, cantSource: 2, tpCancels: 6, otdDealloCount: 59, furnRouted: 447, furnTotal: 595 },
      { day: 12, jobs: 930, ttv: 231280.37, avFee: 111454.11, allocSpend: 2795.12, cantSource: 3, tpCancels: 6, otdDealloCount: 70, furnRouted: 514, furnTotal: 691 },
      { day: 13, jobs: 899, ttv: 272052.79, avFee: 138051.66, allocSpend: 3432.55, cantSource: 3, tpCancels: 15, otdDealloCount: 101, furnRouted: 447, furnTotal: 626 },
      { day: 14, jobs: 853, ttv: 224648.89, avFee: 124557.25, allocSpend: 1529.03, cantSource: 2, tpCancels: 8, otdDealloCount: 50, furnRouted: 518, furnTotal: 664 },
      { day: 15, jobs: 478, ttv: 84283.0, avFee: 44719.59, allocSpend: 1180.86, cantSource: 3, tpCancels: 4, otdDealloCount: 39, furnRouted: 343, furnTotal: 437 },
      { day: 16, jobs: 194, ttv: 26861.0, avFee: 11951.98, allocSpend: 343.39, cantSource: 0, tpCancels: 0, otdDealloCount: 48, furnRouted: 129, furnTotal: 150 },
      { day: 17, jobs: 800, ttv: 170458.72, avFee: 75754.1, allocSpend: 3394.85, cantSource: 4, tpCancels: 60, otdDealloCount: 84, furnRouted: 52, furnTotal: 614 },
      { day: 18, jobs: 449, ttv: 75391.8, avFee: 32975.94, allocSpend: 4249.9, cantSource: 4, tpCancels: 47, otdDealloCount: 58, furnRouted: 37, furnTotal: 339 },
      { day: 19, jobs: 638, ttv: 145234.56, avFee: 69123.45, allocSpend: 2156.78, cantSource: 2, tpCancels: 3, otdDealloCount: 41, furnRouted: 408, furnTotal: 492 },
    ],
    dailyPY: [
      { day: 1, jobs: 1144, ttv: 278440.42, avFee: 139619.6, allocSpend: 1269.66, cantSource: 0, tpCancels: 5, otdDealloCount: 73, furnRouted: 785, furnTotal: 908 },
      { day: 2, jobs: 725, ttv: 112637.6, avFee: 51885.49, allocSpend: 655.89, cantSource: 1, tpCancels: 9, otdDealloCount: 73, furnRouted: 543, furnTotal: 671 },
      { day: 3, jobs: 939, ttv: 208692.66, avFee: 87837.81, allocSpend: 1836.33, cantSource: 1, tpCancels: 3, otdDealloCount: 64, furnRouted: 576, furnTotal: 706 },
      { day: 4, jobs: 719, ttv: 145212.24, avFee: 58701.14, allocSpend: 1294.08, cantSource: 0, tpCancels: 2, otdDealloCount: 43, furnRouted: 465, furnTotal: 549 },
      { day: 5, jobs: 754, ttv: 166768.95, avFee: 68348.51, allocSpend: 1594.0, cantSource: 1, tpCancels: 6, otdDealloCount: 53, furnRouted: 464, furnTotal: 571 },
      { day: 6, jobs: 804, ttv: 183610.03, avFee: 74881.44, allocSpend: 1253.0, cantSource: 1, tpCancels: 2, otdDealloCount: 62, furnRouted: 507, furnTotal: 612 },
      { day: 7, jobs: 1021, ttv: 279541.0, avFee: 125612.74, allocSpend: 2009.0, cantSource: 0, tpCancels: 5, otdDealloCount: 55, furnRouted: 594, furnTotal: 714 },
      { day: 8, jobs: 833, ttv: 197366.82, avFee: 96628.01, allocSpend: 668.0, cantSource: 1, tpCancels: 2, otdDealloCount: 31, furnRouted: 563, furnTotal: 666 },
      { day: 9, jobs: 632, ttv: 112693.91, avFee: 50881.56, allocSpend: 510.0, cantSource: 2, tpCancels: 2, otdDealloCount: 32, furnRouted: 493, furnTotal: 567 },
      { day: 10, jobs: 810, ttv: 187564.04, avFee: 75674.88, allocSpend: 1395.0, cantSource: 0, tpCancels: 4, otdDealloCount: 59, furnRouted: 500, furnTotal: 587 },
      { day: 11, jobs: 688, ttv: 149134.1, avFee: 56785.65, allocSpend: 1791.6, cantSource: 0, tpCancels: 1, otdDealloCount: 42, furnRouted: 411, furnTotal: 517 },
      { day: 12, jobs: 797, ttv: 196411.17, avFee: 81841.78, allocSpend: 1714.0, cantSource: 2, tpCancels: 2, otdDealloCount: 48, furnRouted: 486, furnTotal: 587 },
      { day: 13, jobs: 799, ttv: 182171.68, avFee: 73380.74, allocSpend: 1508.09, cantSource: 0, tpCancels: 3, otdDealloCount: 57, furnRouted: 516, furnTotal: 611 },
      { day: 14, jobs: 1041, ttv: 302833.34, avFee: 136218.5, allocSpend: 2861.0, cantSource: 0, tpCancels: 8, otdDealloCount: 106, furnRouted: 588, furnTotal: 708 },
      { day: 15, jobs: 895, ttv: 212306.09, avFee: 100634.32, allocSpend: 992.2, cantSource: 2, tpCancels: 5, otdDealloCount: 80, furnRouted: 572, furnTotal: 698 },
      { day: 16, jobs: 550, ttv: 97984.8, avFee: 44871.98, allocSpend: 581.0, cantSource: 0, tpCancels: 3, otdDealloCount: 25, furnRouted: 408, furnTotal: 496 },
      { day: 17, jobs: 855, ttv: 200431.35, avFee: 83508.32, allocSpend: 1244.0, cantSource: 0, tpCancels: 0, otdDealloCount: 49, furnRouted: 560, furnTotal: 641 },
      { day: 18, jobs: 725, ttv: 180074.2, avFee: 73287.23, allocSpend: 1560.6, cantSource: 0, tpCancels: 1, otdDealloCount: 45, furnRouted: 441, furnTotal: 533 },
      { day: 19, jobs: 762, ttv: 202141.31, avFee: 81972.39, allocSpend: 1743.0, cantSource: 0, tpCancels: 0, otdDealloCount: 49, furnRouted: 477, furnTotal: 564 },
      { day: 20, jobs: 945, ttv: 263247.63, avFee: 115050.99, allocSpend: 2825.67, cantSource: 0, tpCancels: 0, otdDealloCount: 67, furnRouted: 609, furnTotal: 682 },
      { day: 21, jobs: 1130, ttv: 347146.21, avFee: 165096.01, allocSpend: 3631.18, cantSource: 0, tpCancels: 0, otdDealloCount: 70, furnRouted: 670, furnTotal: 783 },
      { day: 22, jobs: 938, ttv: 250001.65, avFee: 122843.5, allocSpend: 1541.54, cantSource: 0, tpCancels: 0, otdDealloCount: 63, furnRouted: 637, furnTotal: 726 },
      { day: 23, jobs: 666, ttv: 126160.0, avFee: 58741.41, allocSpend: 1191.0, cantSource: 0, tpCancels: 0, otdDealloCount: 36, furnRouted: 472, furnTotal: 593 },
      { day: 24, jobs: 1042, ttv: 276396.19, avFee: 116800.21, allocSpend: 3311.0, cantSource: 0, tpCancels: 0, otdDealloCount: 45, furnRouted: 649, furnTotal: 741 },
      { day: 25, jobs: 1026, ttv: 312439.51, avFee: 138185.53, allocSpend: 4055.73, cantSource: 0, tpCancels: 0, otdDealloCount: 85, furnRouted: 620, furnTotal: 753 },
      { day: 26, jobs: 1126, ttv: 417892.74, avFee: 192079.49, allocSpend: 7668.56, cantSource: 0, tpCancels: 0, otdDealloCount: 69, furnRouted: 654, furnTotal: 777 },
      { day: 27, jobs: 1072, ttv: 517568.81, avFee: 266287.71, allocSpend: 11006.24, cantSource: 0, tpCancels: 0, otdDealloCount: 88, furnRouted: 654, furnTotal: 727 },
      { day: 28, jobs: 950, ttv: 468580.8, avFee: 247014.61, allocSpend: 11379.74, cantSource: 0, tpCancels: 0, otdDealloCount: 74, furnRouted: 561, furnTotal: 630 },
      { day: 29, jobs: 994, ttv: 315819.67, avFee: 167428.44, allocSpend: 6833.83, cantSource: 0, tpCancels: 0, otdDealloCount: 56, furnRouted: 684, furnTotal: 756 },
      { day: 30, jobs: 740, ttv: 263080.63, avFee: 137005.16, allocSpend: 6353.09, cantSource: 0, tpCancels: 0, otdDealloCount: 63, furnRouted: 502, furnTotal: 607 },
      { day: 31, jobs: 998, ttv: 434573.25, avFee: 215679.67, allocSpend: 13538.88, cantSource: 0, tpCancels: 0, otdDealloCount: 91, furnRouted: 610, furnTotal: 665 },
    ],
  },
  spain: {
    current: {
          jobs: 8942,
          ttv: 1892345.67,
          avgTtv: 211.58,
          avFee: 856234.56,
          marginPct: 45.23,
          allocSpend: 28934.12,
          spendTtvPct: 1.53,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 84.33056455019006,
          tpCancelRate: 0,
        },
    priorYear: {
          jobs: 8123,
          ttv: 1678234.56,
          avgTtv: 206.43,
          avFee: 723456.78,
          marginPct: 43.12,
          allocSpend: 19234.56,
          spendTtvPct: 1.15,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 84.33056455019006,
          tpCancelRate: 0,
        },
    dailyCY: [
      { day: 1, jobs: 456, ttv: 89234.56, avFee: 38123.45, allocSpend: 1234.56, cantSource: 3, tpCancels: 5, otdDealloCount: 34, furnRouted: 298, furnTotal: 358 },
      { day: 2, jobs: 567, ttv: 123456.78, avFee: 52345.67, allocSpend: 1567.89, cantSource: 0, tpCancels: 3, otdDealloCount: 45, furnRouted: 367, furnTotal: 428 },
      { day: 3, jobs: 456, ttv: 98765.43, avFee: 42123.45, allocSpend: 1456.78, cantSource: 1, tpCancels: 2, otdDealloCount: 36, furnRouted: 298, furnTotal: 354 },
      { day: 4, jobs: 512, ttv: 110234.56, avFee: 47123.45, allocSpend: 1345.67, cantSource: 2, tpCancels: 3, otdDealloCount: 40, furnRouted: 334, furnTotal: 397 },
      { day: 5, jobs: 489, ttv: 105234.56, avFee: 44123.45, allocSpend: 1234.56, cantSource: 2, tpCancels: 2, otdDealloCount: 38, furnRouted: 318, furnTotal: 375 },
      { day: 6, jobs: 534, ttv: 115234.56, avFee: 49123.45, allocSpend: 1567.89, cantSource: 3, tpCancels: 4, otdDealloCount: 42, furnRouted: 347, furnTotal: 413 },
      { day: 7, jobs: 678, ttv: 145234.56, avFee: 61123.45, allocSpend: 1789.34, cantSource: 4, tpCancels: 5, otdDealloCount: 52, furnRouted: 441, furnTotal: 527 },
      { day: 8, jobs: 445, ttv: 95234.56, avFee: 40123.45, allocSpend: 1123.45, cantSource: 2, tpCancels: 2, otdDealloCount: 34, furnRouted: 289, furnTotal: 343 },
      { day: 9, jobs: 567, ttv: 121234.56, avFee: 51123.45, allocSpend: 1456.78, cantSource: 3, tpCancels: 3, otdDealloCount: 44, furnRouted: 369, furnTotal: 438 },
      { day: 10, jobs: 512, ttv: 109234.56, avFee: 46123.45, allocSpend: 1345.67, cantSource: 2, tpCancels: 2, otdDealloCount: 39, furnRouted: 333, furnTotal: 395 },
      { day: 11, jobs: 489, ttv: 104234.56, avFee: 43123.45, allocSpend: 1234.56, cantSource: 1, tpCancels: 2, otdDealloCount: 37, furnRouted: 318, furnTotal: 377 },
      { day: 12, jobs: 534, ttv: 114234.56, avFee: 48123.45, allocSpend: 1456.78, cantSource: 2, tpCancels: 3, otdDealloCount: 41, furnRouted: 347, furnTotal: 412 },
      { day: 13, jobs: 567, ttv: 121234.56, avFee: 51123.45, allocSpend: 1567.89, cantSource: 3, tpCancels: 4, otdDealloCount: 44, furnRouted: 369, furnTotal: 437 },
      { day: 14, jobs: 512, ttv: 109234.56, avFee: 46123.45, allocSpend: 1345.67, cantSource: 2, tpCancels: 3, otdDealloCount: 39, furnRouted: 333, furnTotal: 394 },
      { day: 15, jobs: 445, ttv: 95234.56, avFee: 40123.45, allocSpend: 1123.45, cantSource: 2, tpCancels: 2, otdDealloCount: 34, furnRouted: 289, furnTotal: 343 },
      { day: 16, jobs: 289, ttv: 61234.56, avFee: 25123.45, allocSpend: 678.9, cantSource: 0, tpCancels: 1, otdDealloCount: 22, furnRouted: 188, furnTotal: 223 },
      { day: 17, jobs: 456, ttv: 97234.56, avFee: 41123.45, allocSpend: 1234.56, cantSource: 2, tpCancels: 25, otdDealloCount: 35, furnRouted: 296, furnTotal: 351 },
      { day: 18, jobs: 312, ttv: 67234.56, avFee: 28123.45, allocSpend: 1456.78, cantSource: 2, tpCancels: 18, otdDealloCount: 24, furnRouted: 203, furnTotal: 238 },
      { day: 19, jobs: 389, ttv: 83234.56, avFee: 35123.45, allocSpend: 1123.45, cantSource: 1, tpCancels: 2, otdDealloCount: 30, furnRouted: 253, furnTotal: 300 },
    ],
    dailyPY: [
      { day: 1, jobs: 605, ttv: 129200, avFee: 54500, allocSpend: 1220, cantSource: 1, tpCancels: 1, otdDealloCount: 46, furnRouted: 392, furnTotal: 467 },
      { day: 2, jobs: 610, ttv: 130400, avFee: 55000, allocSpend: 1240, cantSource: 2, tpCancels: 2, otdDealloCount: 47, furnRouted: 394, furnTotal: 469 },
      { day: 3, jobs: 615, ttv: 131600, avFee: 55500, allocSpend: 1260, cantSource: 3, tpCancels: 0, otdDealloCount: 48, furnRouted: 396, furnTotal: 471 },
      { day: 4, jobs: 620, ttv: 132800, avFee: 56000, allocSpend: 1280, cantSource: 4, tpCancels: 1, otdDealloCount: 49, furnRouted: 398, furnTotal: 473 },
      { day: 5, jobs: 625, ttv: 134000, avFee: 56500, allocSpend: 1300, cantSource: 0, tpCancels: 2, otdDealloCount: 50, furnRouted: 400, furnTotal: 475 },
      { day: 6, jobs: 630, ttv: 135200, avFee: 57000, allocSpend: 1320, cantSource: 1, tpCancels: 0, otdDealloCount: 51, furnRouted: 402, furnTotal: 477 },
      { day: 7, jobs: 635, ttv: 136400, avFee: 57500, allocSpend: 1340, cantSource: 2, tpCancels: 1, otdDealloCount: 52, furnRouted: 404, furnTotal: 479 },
      { day: 8, jobs: 640, ttv: 137600, avFee: 58000, allocSpend: 1360, cantSource: 3, tpCancels: 2, otdDealloCount: 53, furnRouted: 406, furnTotal: 481 },
      { day: 9, jobs: 645, ttv: 138800, avFee: 58500, allocSpend: 1380, cantSource: 4, tpCancels: 0, otdDealloCount: 54, furnRouted: 408, furnTotal: 483 },
      { day: 10, jobs: 650, ttv: 140000, avFee: 59000, allocSpend: 1400, cantSource: 0, tpCancels: 1, otdDealloCount: 55, furnRouted: 410, furnTotal: 485 },
      { day: 11, jobs: 655, ttv: 141200, avFee: 59500, allocSpend: 1420, cantSource: 1, tpCancels: 2, otdDealloCount: 56, furnRouted: 412, furnTotal: 487 },
      { day: 12, jobs: 660, ttv: 142400, avFee: 60000, allocSpend: 1440, cantSource: 2, tpCancels: 0, otdDealloCount: 57, furnRouted: 414, furnTotal: 489 },
      { day: 13, jobs: 665, ttv: 143600, avFee: 60500, allocSpend: 1460, cantSource: 3, tpCancels: 1, otdDealloCount: 58, furnRouted: 416, furnTotal: 491 },
      { day: 14, jobs: 670, ttv: 144800, avFee: 61000, allocSpend: 1480, cantSource: 4, tpCancels: 2, otdDealloCount: 59, furnRouted: 418, furnTotal: 493 },
      { day: 15, jobs: 675, ttv: 146000, avFee: 61500, allocSpend: 1500, cantSource: 0, tpCancels: 0, otdDealloCount: 60, furnRouted: 420, furnTotal: 495 },
      { day: 16, jobs: 680, ttv: 147200, avFee: 62000, allocSpend: 1520, cantSource: 1, tpCancels: 1, otdDealloCount: 61, furnRouted: 422, furnTotal: 497 },
      { day: 17, jobs: 685, ttv: 148400, avFee: 62500, allocSpend: 1540, cantSource: 2, tpCancels: 2, otdDealloCount: 62, furnRouted: 424, furnTotal: 499 },
      { day: 18, jobs: 690, ttv: 149600, avFee: 63000, allocSpend: 1560, cantSource: 3, tpCancels: 0, otdDealloCount: 63, furnRouted: 426, furnTotal: 501 },
      { day: 19, jobs: 695, ttv: 150800, avFee: 63500, allocSpend: 1580, cantSource: 4, tpCancels: 1, otdDealloCount: 64, furnRouted: 428, furnTotal: 503 },
      { day: 20, jobs: 700, ttv: 152000, avFee: 64000, allocSpend: 1600, cantSource: 0, tpCancels: 2, otdDealloCount: 65, furnRouted: 430, furnTotal: 505 },
      { day: 21, jobs: 705, ttv: 153200, avFee: 64500, allocSpend: 1620, cantSource: 1, tpCancels: 0, otdDealloCount: 66, furnRouted: 432, furnTotal: 507 },
      { day: 22, jobs: 710, ttv: 154400, avFee: 65000, allocSpend: 1640, cantSource: 2, tpCancels: 1, otdDealloCount: 67, furnRouted: 434, furnTotal: 509 },
      { day: 23, jobs: 715, ttv: 155600, avFee: 65500, allocSpend: 1660, cantSource: 3, tpCancels: 2, otdDealloCount: 68, furnRouted: 436, furnTotal: 511 },
      { day: 24, jobs: 720, ttv: 156800, avFee: 66000, allocSpend: 1680, cantSource: 4, tpCancels: 0, otdDealloCount: 69, furnRouted: 438, furnTotal: 513 },
      { day: 25, jobs: 725, ttv: 158000, avFee: 66500, allocSpend: 1700, cantSource: 0, tpCancels: 1, otdDealloCount: 70, furnRouted: 440, furnTotal: 515 },
      { day: 26, jobs: 730, ttv: 159200, avFee: 67000, allocSpend: 1720, cantSource: 1, tpCancels: 2, otdDealloCount: 71, furnRouted: 442, furnTotal: 517 },
      { day: 27, jobs: 735, ttv: 160400, avFee: 67500, allocSpend: 1740, cantSource: 2, tpCancels: 0, otdDealloCount: 72, furnRouted: 444, furnTotal: 519 },
      { day: 28, jobs: 740, ttv: 161600, avFee: 68000, allocSpend: 1760, cantSource: 3, tpCancels: 1, otdDealloCount: 73, furnRouted: 446, furnTotal: 521 },
      { day: 29, jobs: 745, ttv: 162800, avFee: 68500, allocSpend: 1780, cantSource: 4, tpCancels: 2, otdDealloCount: 74, furnRouted: 448, furnTotal: 523 },
      { day: 30, jobs: 750, ttv: 164000, avFee: 69000, allocSpend: 1800, cantSource: 0, tpCancels: 0, otdDealloCount: 75, furnRouted: 450, furnTotal: 525 },
      { day: 31, jobs: 755, ttv: 165200, avFee: 69500, allocSpend: 1820, cantSource: 1, tpCancels: 1, otdDealloCount: 76, furnRouted: 452, furnTotal: 527 },
    ],
  },
  france: {
    current: {
          jobs: 7234,
          ttv: 1623456.78,
          avgTtv: 224.34,
          avFee: 754321.09,
          marginPct: 46.48,
          allocSpend: 24856.23,
          spendTtvPct: 1.53,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 84.14737197904344,
          tpCancelRate: 0,
        },
    priorYear: {
          jobs: 6789,
          ttv: 1456234.89,
          avgTtv: 214.56,
          avFee: 623456.78,
          marginPct: 42.77,
          allocSpend: 16789.34,
          spendTtvPct: 1.15,
          otdCancels: 0,
          cantSourceCount: 0,
          cantSourceRate: 0.0,
          tpCancels: 0,
          deallocations: 0,
          otdDeallocations: 0,
          otdDealloPct: 0,
          otdAllocSpend: 0,
          noSpendJobs: 0,
          noSpendPct: 0.0,
          otdAllocatedJobs: 0,
          furnRoutedPct: 84.14737197904344,
          tpCancelRate: 0,
        },
    dailyCY: [
      { day: 1, jobs: 378, ttv: 76234.56, avFee: 32123.45, allocSpend: 1034.56, cantSource: 2, tpCancels: 4, otdDealloCount: 29, furnRouted: 246, furnTotal: 294 },
      { day: 2, jobs: 467, ttv: 99234.56, avFee: 42123.45, allocSpend: 1267.89, cantSource: 0, tpCancels: 2, otdDealloCount: 36, furnRouted: 304, furnTotal: 361 },
      { day: 3, jobs: 389, ttv: 83234.56, avFee: 35123.45, allocSpend: 1156.78, cantSource: 1, tpCancels: 2, otdDealloCount: 30, furnRouted: 253, furnTotal: 300 },
      { day: 4, jobs: 423, ttv: 90234.56, avFee: 38123.45, allocSpend: 1145.67, cantSource: 2, tpCancels: 2, otdDealloCount: 32, furnRouted: 275, furnTotal: 327 },
      { day: 5, jobs: 401, ttv: 85234.56, avFee: 36123.45, allocSpend: 1034.56, cantSource: 1, tpCancels: 2, otdDealloCount: 30, furnRouted: 261, furnTotal: 310 },
      { day: 6, jobs: 445, ttv: 95234.56, avFee: 40123.45, allocSpend: 1267.89, cantSource: 2, tpCancels: 3, otdDealloCount: 34, furnRouted: 289, furnTotal: 343 },
      { day: 7, jobs: 567, ttv: 121234.56, avFee: 51123.45, allocSpend: 1456.78, cantSource: 3, tpCancels: 4, otdDealloCount: 43, furnRouted: 369, furnTotal: 438 },
      { day: 8, jobs: 378, ttv: 80234.56, avFee: 34123.45, allocSpend: 934.56, cantSource: 1, tpCancels: 1, otdDealloCount: 29, furnRouted: 246, furnTotal: 293 },
      { day: 9, jobs: 467, ttv: 99234.56, avFee: 42123.45, allocSpend: 1167.89, cantSource: 2, tpCancels: 2, otdDealloCount: 36, furnRouted: 304, furnTotal: 361 },
      { day: 10, jobs: 423, ttv: 90234.56, avFee: 38123.45, allocSpend: 1145.67, cantSource: 1, tpCancels: 2, otdDealloCount: 32, furnRouted: 275, furnTotal: 327 },
      { day: 11, jobs: 401, ttv: 85234.56, avFee: 36123.45, allocSpend: 1034.56, cantSource: 1, tpCancels: 1, otdDealloCount: 30, furnRouted: 261, furnTotal: 310 },
      { day: 12, jobs: 445, ttv: 95234.56, avFee: 40123.45, allocSpend: 1167.89, cantSource: 2, tpCancels: 2, otdDealloCount: 34, furnRouted: 289, furnTotal: 343 },
      { day: 13, jobs: 467, ttv: 99234.56, avFee: 42123.45, allocSpend: 1267.89, cantSource: 2, tpCancels: 3, otdDealloCount: 36, furnRouted: 304, furnTotal: 361 },
      { day: 14, jobs: 423, ttv: 90234.56, avFee: 38123.45, allocSpend: 1145.67, cantSource: 1, tpCancels: 2, otdDealloCount: 32, furnRouted: 275, furnTotal: 327 },
      { day: 15, jobs: 378, ttv: 80234.56, avFee: 34123.45, allocSpend: 934.56, cantSource: 1, tpCancels: 1, otdDealloCount: 29, furnRouted: 246, furnTotal: 293 },
      { day: 16, jobs: 234, ttv: 50234.56, avFee: 21123.45, allocSpend: 567.89, cantSource: 0, tpCancels: 1, otdDealloCount: 18, furnRouted: 152, furnTotal: 181 },
      { day: 17, jobs: 378, ttv: 80234.56, avFee: 34123.45, allocSpend: 1034.56, cantSource: 1, tpCancels: 20, otdDealloCount: 29, furnRouted: 246, furnTotal: 292 },
      { day: 18, jobs: 267, ttv: 57234.56, avFee: 24123.45, allocSpend: 1167.89, cantSource: 1, tpCancels: 15, otdDealloCount: 20, furnRouted: 174, furnTotal: 206 },
      { day: 19, jobs: 323, ttv: 69234.56, avFee: 29123.45, allocSpend: 934.56, cantSource: 1, tpCancels: 2, otdDealloCount: 25, furnRouted: 210, furnTotal: 250 },
    ],
    dailyPY: [
      { day: 1, jobs: 504, ttv: 107000, avFee: 45420, allocSpend: 1015, cantSource: 1, tpCancels: 1, otdDealloCount: 39, furnRouted: 327, furnTotal: 389 },
      { day: 2, jobs: 508, ttv: 108000, avFee: 45840, allocSpend: 1030, cantSource: 2, tpCancels: 2, otdDealloCount: 40, furnRouted: 329, furnTotal: 391 },
      { day: 3, jobs: 512, ttv: 109000, avFee: 46260, allocSpend: 1045, cantSource: 3, tpCancels: 0, otdDealloCount: 41, furnRouted: 331, furnTotal: 393 },
      { day: 4, jobs: 516, ttv: 110000, avFee: 46680, allocSpend: 1060, cantSource: 0, tpCancels: 1, otdDealloCount: 42, furnRouted: 333, furnTotal: 395 },
      { day: 5, jobs: 520, ttv: 111000, avFee: 47100, allocSpend: 1075, cantSource: 1, tpCancels: 2, otdDealloCount: 43, furnRouted: 335, furnTotal: 397 },
      { day: 6, jobs: 524, ttv: 112000, avFee: 47520, allocSpend: 1090, cantSource: 2, tpCancels: 0, otdDealloCount: 44, furnRouted: 337, furnTotal: 399 },
      { day: 7, jobs: 528, ttv: 113000, avFee: 47940, allocSpend: 1105, cantSource: 3, tpCancels: 1, otdDealloCount: 45, furnRouted: 339, furnTotal: 401 },
      { day: 8, jobs: 532, ttv: 114000, avFee: 48360, allocSpend: 1120, cantSource: 0, tpCancels: 2, otdDealloCount: 46, furnRouted: 341, furnTotal: 403 },
      { day: 9, jobs: 536, ttv: 115000, avFee: 48780, allocSpend: 1135, cantSource: 1, tpCancels: 0, otdDealloCount: 47, furnRouted: 343, furnTotal: 405 },
      { day: 10, jobs: 540, ttv: 116000, avFee: 49200, allocSpend: 1150, cantSource: 2, tpCancels: 1, otdDealloCount: 48, furnRouted: 345, furnTotal: 407 },
      { day: 11, jobs: 544, ttv: 117000, avFee: 49620, allocSpend: 1165, cantSource: 3, tpCancels: 2, otdDealloCount: 49, furnRouted: 347, furnTotal: 409 },
      { day: 12, jobs: 548, ttv: 118000, avFee: 50040, allocSpend: 1180, cantSource: 0, tpCancels: 0, otdDealloCount: 50, furnRouted: 349, furnTotal: 411 },
      { day: 13, jobs: 552, ttv: 119000, avFee: 50460, allocSpend: 1195, cantSource: 1, tpCancels: 1, otdDealloCount: 51, furnRouted: 351, furnTotal: 413 },
      { day: 14, jobs: 556, ttv: 120000, avFee: 50880, allocSpend: 1210, cantSource: 2, tpCancels: 2, otdDealloCount: 52, furnRouted: 353, furnTotal: 415 },
      { day: 15, jobs: 560, ttv: 121000, avFee: 51300, allocSpend: 1225, cantSource: 3, tpCancels: 0, otdDealloCount: 53, furnRouted: 355, furnTotal: 417 },
      { day: 16, jobs: 564, ttv: 122000, avFee: 51720, allocSpend: 1240, cantSource: 0, tpCancels: 1, otdDealloCount: 54, furnRouted: 357, furnTotal: 419 },
      { day: 17, jobs: 568, ttv: 123000, avFee: 52140, allocSpend: 1255, cantSource: 1, tpCancels: 2, otdDealloCount: 55, furnRouted: 359, furnTotal: 421 },
      { day: 18, jobs: 572, ttv: 124000, avFee: 52560, allocSpend: 1270, cantSource: 2, tpCancels: 0, otdDealloCount: 56, furnRouted: 361, furnTotal: 423 },
      { day: 19, jobs: 576, ttv: 125000, avFee: 52980, allocSpend: 1285, cantSource: 3, tpCancels: 1, otdDealloCount: 57, furnRouted: 363, furnTotal: 425 },
      { day: 20, jobs: 580, ttv: 126000, avFee: 53400, allocSpend: 1300, cantSource: 0, tpCancels: 2, otdDealloCount: 58, furnRouted: 365, furnTotal: 427 },
      { day: 21, jobs: 584, ttv: 127000, avFee: 53820, allocSpend: 1315, cantSource: 1, tpCancels: 0, otdDealloCount: 59, furnRouted: 367, furnTotal: 429 },
      { day: 22, jobs: 588, ttv: 128000, avFee: 54240, allocSpend: 1330, cantSource: 2, tpCancels: 1, otdDealloCount: 60, furnRouted: 369, furnTotal: 431 },
      { day: 23, jobs: 592, ttv: 129000, avFee: 54660, allocSpend: 1345, cantSource: 3, tpCancels: 2, otdDealloCount: 61, furnRouted: 371, furnTotal: 433 },
      { day: 24, jobs: 596, ttv: 130000, avFee: 55080, allocSpend: 1360, cantSource: 0, tpCancels: 0, otdDealloCount: 62, furnRouted: 373, furnTotal: 435 },
      { day: 25, jobs: 600, ttv: 131000, avFee: 55500, allocSpend: 1375, cantSource: 1, tpCancels: 1, otdDealloCount: 63, furnRouted: 375, furnTotal: 437 },
      { day: 26, jobs: 604, ttv: 132000, avFee: 55920, allocSpend: 1390, cantSource: 2, tpCancels: 2, otdDealloCount: 64, furnRouted: 377, furnTotal: 439 },
      { day: 27, jobs: 608, ttv: 133000, avFee: 56340, allocSpend: 1405, cantSource: 3, tpCancels: 0, otdDealloCount: 65, furnRouted: 379, furnTotal: 441 },
      { day: 28, jobs: 612, ttv: 134000, avFee: 56760, allocSpend: 1420, cantSource: 0, tpCancels: 1, otdDealloCount: 66, furnRouted: 381, furnTotal: 443 },
      { day: 29, jobs: 616, ttv: 135000, avFee: 57180, allocSpend: 1435, cantSource: 1, tpCancels: 2, otdDealloCount: 67, furnRouted: 383, furnTotal: 445 },
      { day: 30, jobs: 620, ttv: 136000, avFee: 57600, allocSpend: 1450, cantSource: 2, tpCancels: 0, otdDealloCount: 68, furnRouted: 385, furnTotal: 447 },
      { day: 31, jobs: 624, ttv: 137000, avFee: 58020, allocSpend: 1465, cantSource: 3, tpCancels: 1, otdDealloCount: 69, furnRouted: 387, furnTotal: 449 },
    ],
  },
};

export const categoriesData: CategoryRow[] = [
    { category: 'Furniture', jobs: 4567, ttv: 892345.67, marginPct: 42.34, allocSpend: 12345.67, spendTtvPct: 1.38 },
    { category: 'Home Removal', jobs: 3456, ttv: 1234567.89, marginPct: 52.12, allocSpend: 18234.56, spendTtvPct: 1.48 },
    { category: 'Car', jobs: 2345, ttv: 456789.12, marginPct: 35.67, allocSpend: 7234.56, spendTtvPct: 1.58 },
    { category: 'Motorbike', jobs: 1234, ttv: 234567.89, marginPct: 28.45, allocSpend: 3456.78, spendTtvPct: 1.47 },
    { category: 'Piano', jobs: 567, ttv: 145678.9, marginPct: 38.9, allocSpend: 2345.67, spendTtvPct: 1.61 },
  ];

export const regionsData: RegionRow[] = [
    { region: 'South East', jobs: 3456, ttv: 812345.67, marginPct: 47.23, allocSpend: 11234.56, spendTtvPct: 1.38 },
    { region: 'London', jobs: 2891, ttv: 723456.78, marginPct: 49.12, allocSpend: 10234.56, spendTtvPct: 1.41 },
    { region: 'West Midlands', jobs: 2345, ttv: 567234.56, marginPct: 45.67, allocSpend: 8234.56, spendTtvPct: 1.45 },
    { region: 'East Midlands', jobs: 1876, ttv: 423456.78, marginPct: 44.23, allocSpend: 6234.56, spendTtvPct: 1.47 },
    { region: 'North West', jobs: 1654, ttv: 378234.56, marginPct: 43.45, allocSpend: 5234.56, spendTtvPct: 1.38 },
    { region: 'Yorkshire and The Humber', jobs: 1234, ttv: 289456.78, marginPct: 42.12, allocSpend: 4234.56, spendTtvPct: 1.46 },
    { region: 'East', jobs: 987, ttv: 234567.89, marginPct: 41.23, allocSpend: 3234.56, spendTtvPct: 1.38 },
    { region: 'South West', jobs: 876, ttv: 201234.56, marginPct: 40.12, allocSpend: 2934.56, spendTtvPct: 1.46 },
    { region: 'North East', jobs: 654, ttv: 156789.12, marginPct: 39.45, allocSpend: 2234.56, spendTtvPct: 1.42 },
    { region: 'Wales', jobs: 432, ttv: 87234.56, marginPct: 38.67, allocSpend: 1234.56, spendTtvPct: 1.41 },
  ];

export const trendsByCountry: Record<Country, TrendPoint[]> = {
  uk: [
    { month: '2025-02', jobs: 14000, ttv: 3200000, avFee: 1450000, marginPct: 45.23, allocSpend: 45000, spendTtvPct: 1.4, otdCancels: 280, tpCancels: 1100, cantSourceCount: 50, otdDeallocations: 1250, adminAllocD1Otd: 0, totalRecords: 14500 },
    { month: '2025-03', jobs: 14100, ttv: 3250000, avFee: 1475000, marginPct: 45.529999999999994, allocSpend: 47000, spendTtvPct: 1.45, otdCancels: 285, tpCancels: 1110, cantSourceCount: 52, otdDeallocations: 1270, adminAllocD1Otd: 0, totalRecords: 14650 },
    { month: '2025-04', jobs: 14200, ttv: 3300000, avFee: 1500000, marginPct: 45.83, allocSpend: 49000, spendTtvPct: 1.5, otdCancels: 290, tpCancels: 1120, cantSourceCount: 54, otdDeallocations: 1290, adminAllocD1Otd: 0, totalRecords: 14800 },
    { month: '2025-05', jobs: 14300, ttv: 3350000, avFee: 1525000, marginPct: 46.129999999999995, allocSpend: 51000, spendTtvPct: 1.5499999999999998, otdCancels: 295, tpCancels: 1130, cantSourceCount: 56, otdDeallocations: 1310, adminAllocD1Otd: 0, totalRecords: 14950 },
    { month: '2025-06', jobs: 14400, ttv: 3400000, avFee: 1550000, marginPct: 46.43, allocSpend: 53000, spendTtvPct: 1.5999999999999999, otdCancels: 300, tpCancels: 1140, cantSourceCount: 58, otdDeallocations: 1330, adminAllocD1Otd: 0, totalRecords: 15100 },
    { month: '2025-07', jobs: 14500, ttv: 3450000, avFee: 1575000, marginPct: 46.73, allocSpend: 55000, spendTtvPct: 1.65, otdCancels: 305, tpCancels: 1150, cantSourceCount: 60, otdDeallocations: 1350, adminAllocD1Otd: 0, totalRecords: 15250 },
    { month: '2025-08', jobs: 14600, ttv: 3500000, avFee: 1600000, marginPct: 47.029999999999994, allocSpend: 57000, spendTtvPct: 1.7, otdCancels: 310, tpCancels: 1160, cantSourceCount: 62, otdDeallocations: 1370, adminAllocD1Otd: 0, totalRecords: 15400 },
    { month: '2025-09', jobs: 14700, ttv: 3550000, avFee: 1625000, marginPct: 47.33, allocSpend: 59000, spendTtvPct: 1.75, otdCancels: 315, tpCancels: 1170, cantSourceCount: 64, otdDeallocations: 1390, adminAllocD1Otd: 0, totalRecords: 15550 },
    { month: '2025-10', jobs: 14800, ttv: 3600000, avFee: 1650000, marginPct: 47.629999999999995, allocSpend: 61000, spendTtvPct: 1.7999999999999998, otdCancels: 320, tpCancels: 1180, cantSourceCount: 66, otdDeallocations: 1410, adminAllocD1Otd: 0, totalRecords: 15700 },
    { month: '2025-11', jobs: 14900, ttv: 3650000, avFee: 1675000, marginPct: 47.93, allocSpend: 63000, spendTtvPct: 1.8499999999999999, otdCancels: 325, tpCancels: 1190, cantSourceCount: 68, otdDeallocations: 1430, adminAllocD1Otd: 0, totalRecords: 15850 },
    { month: '2025-12', jobs: 15000, ttv: 3700000, avFee: 1700000, marginPct: 48.23, allocSpend: 65000, spendTtvPct: 1.9, otdCancels: 330, tpCancels: 1200, cantSourceCount: 70, otdDeallocations: 1450, adminAllocD1Otd: 0, totalRecords: 16000 },
    { month: '2026-01', jobs: 15100, ttv: 3750000, avFee: 1725000, marginPct: 48.529999999999994, allocSpend: 67000, spendTtvPct: 1.95, otdCancels: 335, tpCancels: 1210, cantSourceCount: 72, otdDeallocations: 1470, adminAllocD1Otd: 0, totalRecords: 16150 },
    { month: '2026-02', jobs: 15200, ttv: 3800000, avFee: 1750000, marginPct: 48.83, allocSpend: 69000, spendTtvPct: 2.0, otdCancels: 340, tpCancels: 1220, cantSourceCount: 74, otdDeallocations: 1490, adminAllocD1Otd: 0, totalRecords: 16300 },
    { month: '2026-03', jobs: 15300, ttv: 3850000, avFee: 1775000, marginPct: 49.129999999999995, allocSpend: 71000, spendTtvPct: 2.05, otdCancels: 345, tpCancels: 1230, cantSourceCount: 76, otdDeallocations: 1510, adminAllocD1Otd: 0, totalRecords: 16450 },
  ],
  spain: [
    { month: '2025-02', jobs: 8200, ttv: 1750000, avFee: 780000, marginPct: 44.56, allocSpend: 26000, spendTtvPct: 1.49, otdCancels: 150, tpCancels: 620, cantSourceCount: 28, otdDeallocations: 725, adminAllocD1Otd: 0, totalRecords: 8450 },
    { month: '2025-03', jobs: 8250, ttv: 1780000, avFee: 794000, marginPct: 44.81, allocSpend: 27200, spendTtvPct: 1.53, otdCancels: 153, tpCancels: 626, cantSourceCount: 29, otdDeallocations: 737, adminAllocD1Otd: 0, totalRecords: 8530 },
    { month: '2025-04', jobs: 8300, ttv: 1810000, avFee: 808000, marginPct: 45.06, allocSpend: 28400, spendTtvPct: 1.57, otdCancels: 156, tpCancels: 632, cantSourceCount: 30, otdDeallocations: 749, adminAllocD1Otd: 0, totalRecords: 8610 },
    { month: '2025-05', jobs: 8350, ttv: 1840000, avFee: 822000, marginPct: 45.31, allocSpend: 29600, spendTtvPct: 1.6099999999999999, otdCancels: 159, tpCancels: 638, cantSourceCount: 31, otdDeallocations: 761, adminAllocD1Otd: 0, totalRecords: 8690 },
    { month: '2025-06', jobs: 8400, ttv: 1870000, avFee: 836000, marginPct: 45.56, allocSpend: 30800, spendTtvPct: 1.65, otdCancels: 162, tpCancels: 644, cantSourceCount: 32, otdDeallocations: 773, adminAllocD1Otd: 0, totalRecords: 8770 },
    { month: '2025-07', jobs: 8450, ttv: 1900000, avFee: 850000, marginPct: 45.81, allocSpend: 32000, spendTtvPct: 1.69, otdCancels: 165, tpCancels: 650, cantSourceCount: 33, otdDeallocations: 785, adminAllocD1Otd: 0, totalRecords: 8850 },
    { month: '2025-08', jobs: 8500, ttv: 1930000, avFee: 864000, marginPct: 46.06, allocSpend: 33200, spendTtvPct: 1.73, otdCancels: 168, tpCancels: 656, cantSourceCount: 34, otdDeallocations: 797, adminAllocD1Otd: 0, totalRecords: 8930 },
    { month: '2025-09', jobs: 8550, ttv: 1960000, avFee: 878000, marginPct: 46.31, allocSpend: 34400, spendTtvPct: 1.77, otdCancels: 171, tpCancels: 662, cantSourceCount: 35, otdDeallocations: 809, adminAllocD1Otd: 0, totalRecords: 9010 },
    { month: '2025-10', jobs: 8600, ttv: 1990000, avFee: 892000, marginPct: 46.56, allocSpend: 35600, spendTtvPct: 1.81, otdCancels: 174, tpCancels: 668, cantSourceCount: 36, otdDeallocations: 821, adminAllocD1Otd: 0, totalRecords: 9090 },
    { month: '2025-11', jobs: 8650, ttv: 2020000, avFee: 906000, marginPct: 46.81, allocSpend: 36800, spendTtvPct: 1.85, otdCancels: 177, tpCancels: 674, cantSourceCount: 37, otdDeallocations: 833, adminAllocD1Otd: 0, totalRecords: 9170 },
    { month: '2025-12', jobs: 8700, ttv: 2050000, avFee: 920000, marginPct: 47.06, allocSpend: 38000, spendTtvPct: 1.8900000000000001, otdCancels: 180, tpCancels: 680, cantSourceCount: 38, otdDeallocations: 845, adminAllocD1Otd: 0, totalRecords: 9250 },
    { month: '2026-01', jobs: 8750, ttv: 2080000, avFee: 934000, marginPct: 47.31, allocSpend: 39200, spendTtvPct: 1.93, otdCancels: 183, tpCancels: 686, cantSourceCount: 39, otdDeallocations: 857, adminAllocD1Otd: 0, totalRecords: 9330 },
    { month: '2026-02', jobs: 8800, ttv: 2110000, avFee: 948000, marginPct: 47.56, allocSpend: 40400, spendTtvPct: 1.97, otdCancels: 186, tpCancels: 692, cantSourceCount: 40, otdDeallocations: 869, adminAllocD1Otd: 0, totalRecords: 9410 },
    { month: '2026-03', jobs: 8850, ttv: 2140000, avFee: 962000, marginPct: 47.81, allocSpend: 41600, spendTtvPct: 2.01, otdCancels: 189, tpCancels: 698, cantSourceCount: 41, otdDeallocations: 881, adminAllocD1Otd: 0, totalRecords: 9490 },
  ],
  france: [
    { month: '2025-02', jobs: 6800, ttv: 1520000, avFee: 680000, marginPct: 44.74, allocSpend: 22000, spendTtvPct: 1.45, otdCancels: 120, tpCancels: 480, cantSourceCount: 22, otdDeallocations: 580, adminAllocD1Otd: 0, totalRecords: 7000 },
    { month: '2025-03', jobs: 6840, ttv: 1545000, avFee: 692000, marginPct: 44.96, allocSpend: 23000, spendTtvPct: 1.48, otdCancels: 122, tpCancels: 485, cantSourceCount: 23, otdDeallocations: 590, adminAllocD1Otd: 0, totalRecords: 7065 },
    { month: '2025-04', jobs: 6880, ttv: 1570000, avFee: 704000, marginPct: 45.18, allocSpend: 24000, spendTtvPct: 1.51, otdCancels: 124, tpCancels: 490, cantSourceCount: 24, otdDeallocations: 600, adminAllocD1Otd: 0, totalRecords: 7130 },
    { month: '2025-05', jobs: 6920, ttv: 1595000, avFee: 716000, marginPct: 45.4, allocSpend: 25000, spendTtvPct: 1.54, otdCancels: 126, tpCancels: 495, cantSourceCount: 25, otdDeallocations: 610, adminAllocD1Otd: 0, totalRecords: 7195 },
    { month: '2025-06', jobs: 6960, ttv: 1620000, avFee: 728000, marginPct: 45.620000000000005, allocSpend: 26000, spendTtvPct: 1.5699999999999998, otdCancels: 128, tpCancels: 500, cantSourceCount: 26, otdDeallocations: 620, adminAllocD1Otd: 0, totalRecords: 7260 },
    { month: '2025-07', jobs: 7000, ttv: 1645000, avFee: 740000, marginPct: 45.84, allocSpend: 27000, spendTtvPct: 1.5999999999999999, otdCancels: 130, tpCancels: 505, cantSourceCount: 27, otdDeallocations: 630, adminAllocD1Otd: 0, totalRecords: 7325 },
    { month: '2025-08', jobs: 7040, ttv: 1670000, avFee: 752000, marginPct: 46.06, allocSpend: 28000, spendTtvPct: 1.63, otdCancels: 132, tpCancels: 510, cantSourceCount: 28, otdDeallocations: 640, adminAllocD1Otd: 0, totalRecords: 7390 },
    { month: '2025-09', jobs: 7080, ttv: 1695000, avFee: 764000, marginPct: 46.28, allocSpend: 29000, spendTtvPct: 1.66, otdCancels: 134, tpCancels: 515, cantSourceCount: 29, otdDeallocations: 650, adminAllocD1Otd: 0, totalRecords: 7455 },
    { month: '2025-10', jobs: 7120, ttv: 1720000, avFee: 776000, marginPct: 46.5, allocSpend: 30000, spendTtvPct: 1.69, otdCancels: 136, tpCancels: 520, cantSourceCount: 30, otdDeallocations: 660, adminAllocD1Otd: 0, totalRecords: 7520 },
    { month: '2025-11', jobs: 7160, ttv: 1745000, avFee: 788000, marginPct: 46.72, allocSpend: 31000, spendTtvPct: 1.72, otdCancels: 138, tpCancels: 525, cantSourceCount: 31, otdDeallocations: 670, adminAllocD1Otd: 0, totalRecords: 7585 },
    { month: '2025-12', jobs: 7200, ttv: 1770000, avFee: 800000, marginPct: 46.940000000000005, allocSpend: 32000, spendTtvPct: 1.75, otdCancels: 140, tpCancels: 530, cantSourceCount: 32, otdDeallocations: 680, adminAllocD1Otd: 0, totalRecords: 7650 },
    { month: '2026-01', jobs: 7240, ttv: 1795000, avFee: 812000, marginPct: 47.160000000000004, allocSpend: 33000, spendTtvPct: 1.7799999999999998, otdCancels: 142, tpCancels: 535, cantSourceCount: 33, otdDeallocations: 690, adminAllocD1Otd: 0, totalRecords: 7715 },
    { month: '2026-02', jobs: 7280, ttv: 1820000, avFee: 824000, marginPct: 47.38, allocSpend: 34000, spendTtvPct: 1.81, otdCancels: 144, tpCancels: 540, cantSourceCount: 34, otdDeallocations: 700, adminAllocD1Otd: 0, totalRecords: 7780 },
    { month: '2026-03', jobs: 7320, ttv: 1845000, avFee: 836000, marginPct: 47.6, allocSpend: 35000, spendTtvPct: 1.8399999999999999, otdCancels: 146, tpCancels: 545, cantSourceCount: 35, otdDeallocations: 710, adminAllocD1Otd: 0, totalRecords: 7845 },
  ],
};

export const otdMetricsData: OtdMetrics = {
  otdJobsWithDeallos: 1148,
  otdAllocSpend: 42567.89,
  otdAllocatedJobs: 3456,
  noSpendJobs: 234,
  noSpendPct: 0,
};

export const deallocationsData: DeallocationData = {
  deallocations: 1148,
  otdDeallocations: 1456,
  otdDealloPct: 9.46,
  otdDealloCount: 1456,
  otdJobsWithDeallos: 1148,
  otdAllocSpend: 42567.89,
};

// Placeholder exports for remaining data structures
export const trendsByCategoryAndCountry: Record<Country, Record<CategoryType, TrendPoint[]>> = {
  uk: {
    furniture: [],
    homeRemoval: [],
    car: [],
    motorbike: [],
    piano: [],
    journey: [],
  },
  spain: {
    furniture: [],
    homeRemoval: [],
    car: [],
    motorbike: [],
    piano: [],
    journey: [],
  },
  france: {
    furniture: [],
    homeRemoval: [],
    car: [],
    motorbike: [],
    piano: [],
    journey: [],
  },
};

export const categoryBreakdownByCountry: Record<Country, CategoryBreakdownRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const activeBookingsByCountry: Record<Country, ActiveBookingRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const dailyOverview: DailyOverviewRow[] = [];
export const dailyOverviewPY: DailyOverviewRow[] = [];
export const dailyOverviewSpain: DailyOverviewRow[] = [];
export const dailyOverviewSpainPY: DailyOverviewRow[] = [];
export const dailyOverviewFrance: DailyOverviewRow[] = [];
export const dailyOverviewFrancePY: DailyOverviewRow[] = [];

export const furnRoutingByCountry: Record<string, Record<string, { routed: number; total: number }>> = {
  uk_cy: {},
  uk_py: {},
  spain_cy: {},
  spain_py: {},
  france_cy: {},
  france_py: {},
};

export const tpCancelsByCountry: Record<string, Record<string, number>> = {
  uk_cy: {},
  uk_py: {},
  spain_cy: {},
  spain_py: {},
  france_cy: {},
  france_py: {},
};

export const partialMonthComparisonByCountry: Record<string, any> = {
  uk: { cutoffDay: 0, currentMonth: '', mom: {}, yoy: {} },
  spain: { cutoffDay: 0, currentMonth: '', mom: {}, yoy: {} },
  france: { cutoffDay: 0, currentMonth: '', mom: {}, yoy: {} },
};

export const spendByNutsByCountry: Record<Country, SpendNutsRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const spendByCategoryByCountry: Record<Country, SpendCategoryRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const spendByDaysByCountry: Record<Country, SpendByDaysRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const agentSpendByCountry: Record<Country, AgentSpendRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const mtdRaw2026: MtdSpendRawRow[] = [];
export const mtdRaw2025: MtdSpendRawRow[] = [];

export const cancellationRaw2026ByCountry: Record<Country, CancellationRawRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const cancellationRaw2025ByCountry: Record<Country, CancellationRawRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const completedPaidRaw2026ByCountry: Record<Country, CompletedPaidRawRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const completedPaidRaw2025ByCountry: Record<Country, CompletedPaidRawRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const monthlyCancellationTrendsByCountry: Record<Country, MonthlyCancellationRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const monthlyCompletedPaidTrendsByCountry: Record<Country, MonthlyCompletedPaidRow[]> = {
  uk: [],
  spain: [],
  france: [],
};

export const iresReservationData: IResReservationRow[] = [];
export const iresTrendData: IResTrendRow[] = [];

// Derived data for hooks
export const trendsData: TrendPoint[] = trendsByCountry.uk || [];

export const dailyOverviewByCountry: Record<string, { cy: DailyOverviewRow[], py: DailyOverviewRow[] }> = {
  uk: { cy: dailyOverview, py: dailyOverviewPY },
  spain: { cy: dailyOverviewSpain, py: dailyOverviewSpainPY },
  france: { cy: dailyOverviewFrance, py: dailyOverviewFrancePY },
};

export const spendByNutsData: SpendNutsRow[] = spendByNutsByCountry.uk || [];
export const spendByCategoryData: SpendCategoryRow[] = spendByCategoryByCountry.uk || [];
