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

export const filteredItems = derived(
  [dateRange, strikesresult],
  ([$dateRange, $strikesresult]) => {
    if (!$dateRange.start || !$dateRange.end) {
      return $strikesresult;
    }

    const startDate = $dateRange.start.toDate(getLocalTimeZone());
    const endDate = $dateRange.end.toDate(getLocalTimeZone());

    return $strikesresult.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }
);
