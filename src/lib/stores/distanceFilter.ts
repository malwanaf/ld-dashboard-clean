// src/lib/stores/filters.ts
import { writable } from 'svelte/store';
import { maxDistance } from './maxDistance';



// Store for distance range filter
export const distanceRangeFilter = writable([0, 100]); // Initial value: [min, max]
