// src/lib/stores/filters.ts
import { writable } from 'svelte/store';

// Store for distance range filter
export const distanceRangeFilter = writable([0, 100]); // Initial value: [min, max]
