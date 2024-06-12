// src/lib/stores/maxDistance.ts
import { derived } from 'svelte/store';
import { copyOfStrikesResult } from '$lib/stores/strikes';

export const maxDistance = derived(copyOfStrikesResult, $copyOfStrikesResult => {
  return $copyOfStrikesResult.reduce((max, item) => (item.distance > max ? item.distance : max), 0);
});
