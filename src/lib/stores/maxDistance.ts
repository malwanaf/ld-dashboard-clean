// src/lib/stores/maxDistance.ts
import { derived } from 'svelte/store';
import { strikesresult } from '$lib/stores/strikes';

export const maxDistance = derived(strikesresult, $strikesresult => {
  return $strikesresult.reduce((max, item) => (item.distance > max ? item.distance : max), 0);
});
