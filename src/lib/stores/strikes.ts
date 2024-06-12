import { writable } from "svelte/store";

export const strikesresult = writable([]);
// Copy of the store and update function
export const copyOfStrikesResult = writable([]);
export const mapOfStrikesResult = writable([]);

export function updateStrikesResult(data){
    strikesresult.set(data);
    copyOfStrikesResult.set(data);
    mapOfStrikesResult.set(data);
}

