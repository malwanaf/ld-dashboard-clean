// src/lib/stores/filteredItems.ts
import { derived } from 'svelte/store';
import { dateRange } from '$lib/stores/dateRange';
import { strikesresult } from '$lib/stores/strikes';
import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    today
  } from "@internationalized/date";    
    import { distanceRangeFilter } from '$lib/stores/distanceFilter';

export const filteredItems = derived(
  [dateRange, strikesresult, distanceRangeFilter],
  ([$dateRange, $strikesresult, $distanceRangeFilter]) => {
    const startDate = $dateRange.start?.toDate(getLocalTimeZone());
    const endDate = $dateRange.end?.toDate(getLocalTimeZone());
    const [minDistance, maxDistance] = $distanceRangeFilter;

    return $strikesresult.filter(item => {
      const itemDate = new Date(item.time);
      const withinDateRange = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
      const withinDistanceRange = item.distance >= minDistance && item.distance <= maxDistance;
      return withinDateRange && withinDistanceRange;
    });
  }
);
