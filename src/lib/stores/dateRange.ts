// store.ts
import { writable } from 'svelte/store';
import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    today
  } from "@internationalized/date";

// Initializing start and end dates
const end = today(getLocalTimeZone());
const start = end.subtract({ days: 7 });

// Creating a writable store with initial value
export const dateRange = writable({
  start,
  end
});
