<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import StrikesTable from '$lib/components/main/StrikesTable.svelte';
	import StrikesMap from '$lib/components/main/StrikesMap.svelte';
	import { type PaneAPI } from 'paneforge';
	import Button from '$lib/components/ui/button/button.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import { DoubleArrowDown, Enter } from 'svelte-radix';
    import { DoubleArrowUp } from 'svelte-radix';
	import {EnterFullScreen} from 'svelte-radix';
	import * as Tooltip from "$lib/components/ui/tooltip";

	let paneOne: PaneAPI;
	let currentState = 0; // 0: collapsed, 1: size 50, 2: size 100

	function togglePane() {
		if (currentState === 0) {
			paneOne.expand();
			paneOne.resize(50);
			currentState = 1;
		} else if (currentState === 1) {
			paneOne.resize(100);
			currentState = 2;
		} else {
			paneOne.collapse();
			currentState = 0;
		}
	}
</script>

<div class="absolute bottom-0 right-0 z-20 mr-2 space-y-2">
	<Tooltip.Root>
		<Tooltip.Trigger>			
			<Button class="rounded-b-none" on:click={togglePane}>
				{#if currentState === 0}
					<DoubleArrowUp size={20} class="stroke-1 stroke-white dark:stroke-black" />
				{:else if currentState === 2}
					<DoubleArrowDown size={20} class="stroke-1 stroke-white dark:stroke-black" />
				{:else}
					<EnterFullScreen size={20} class="stroke-1 stroke-white dark:stroke-black" />
				{/if}
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p class="text-sm leading-7 [&:not(:first-child)]:mt-6">
			{#if currentState ===0}
			Show Data Table
			{:else if currentState === 2}
			Minimize
			{:else}
			Maximize
			{/if}</p>
		</Tooltip.Content>
	  </Tooltip.Root>
	
</div>

<Resizable.PaneGroup direction="vertical" class="max-w-screen min-h-screen">
	<Resizable.Pane defaultSize={100}>
		<div class="flex h-full items-center justify-center overflow-auto p-0">
			<StrikesMap />
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />	
	<Resizable.Pane
		defaultSize={0}
		collapsedSize={0}
		collapsible={true}
		minSize={0}
		bind:pane={paneOne}
	>
		<div class="h-full items-center justify-center p-2">
			<StrikesTable />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
