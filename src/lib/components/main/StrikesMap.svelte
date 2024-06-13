<script lang="ts">
	import type { LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/components/map/Leaflet.svelte';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import LightningPopup from '$lib/components/secondary/LightningPopup.svelte';
	import { fade } from 'svelte/transition';
	import StrikeIndicator from '$lib/components/secondary/StrikeIndicator.svelte';
	import DigitalClock from '$lib/components/secondary/DigitalClock.svelte';
	let websocketIndicatorColor = 'red';
	import LineChart from '$lib/components/secondary/LineChart.svelte';
	import * as Collapsible from "$lib/components/ui/collapsible";
	import { Button } from "$lib/components/ui/button";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";

	import { strikesresult } from '$lib/stores/strikes';
	import { dbstatus } from '$lib/stores/dbstatus';
    
	const initialView: LatLngExpression = [-7.816177085162616, 110.29458648417666];
	const markerLocations: Array<LatLngExpression> = [[-7.816177085162616, 110.29458648417666]];

	$: console.log($dbstatus);
	if ($dbstatus == 'connected') {
		websocketIndicatorColor = 'green';
	} else {
		websocketIndicatorColor = 'red';
	}

</script>

<div class="relative w-full h-full overflow-hidden">
	<div class="absolute top-0 left-0 z-20 m-2 space-y-2">
		<Badge variant="secondary">
			<DigitalClock />
		</Badge>
	</div>

	<div class="absolute top-0 right-0 z-20 m-2">
		<Collapsible.Root class="w-[350px] space-y-2 bg-black/75 rounded-lg">
			<div class="flex items-center justify-between space-x-4 px-4 py-1">
			  <h4 class="text-sm font-semibold p-2 text-white">Lightning Chart</h4>
			  <Collapsible.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0 dark:hover:bg-zinc-800 hover:bg-zinc-800">
					<ChevronsUpDown class="h-4 w-4 text-white " />
					<span class="sr-only">Toggle</span>
				  </Button>
			  </Collapsible.Trigger>
			</div>
			
			<Collapsible.Content class="">
				<LineChart />
			</Collapsible.Content>
			<div class="flex items-center justify-between space-x-2 px-6 pb-4">
				<p class="text-white text-sm flex-grow font-semibold">Intensity </p>
				<Badge variant="blue">
					<span class="text-black text-xs font-semibold"> ≤5</span>
				</Badge>
				<Badge variant="warning">
					<span class="text-black text-xs font-semibold">6 - 10</span>
				</Badge>
				<Badge variant="red">
					<span class="text-black text-xs font-semibold"> &gt;10</span>
				</Badge>
			</div>
		  </Collapsible.Root>
		
	</div>

	<div class="absolute bottom-0 left-0 z-30 m-2">
		<!-- <LightningPopup /> -->
	</div>

	<div class="h-full w-full">
		<Leaflet view={initialView} zoom={12}>
			{#each markerLocations as latLng}
				<Marker {latLng} width={40} height={40}>
					<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 50 50">
						<path d="M20,10 L20,30 M10,20 L30,20" stroke="red" stroke-width="2" style="fill:#e9204f;fill-rule:nonzero" transform="matrix(1.25,0,0,1.25,0,0)" />
					</svg>
					<Popup>Sensor Location</Popup>
				</Marker>
			{/each}
		</Leaflet>
	</div>
</div>
