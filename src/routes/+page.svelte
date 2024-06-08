<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import StrikesTable from '$lib/components/main/StrikesTable.svelte';
	import StrikesMap from '$lib/components/main/StrikesMap.svelte';
	import { type PaneAPI } from 'paneforge';
	import Button from '$lib/components/ui/button/button.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import { DoubleArrowDown } from 'svelte-radix';
    import { DoubleArrowUp } from 'svelte-radix';

	let paneOne: PaneAPI;
	let collapsed = false;
    
    function togglePane() {
        if (collapsed) {
            paneOne.expand();
            paneOne.resize(50);

            
        } else {
            paneOne.collapse();
            
        }
    }
</script>

<div class="absolute bottom-0 right-0 z-20 mr-2 space-y-2 ">
		<Button class="rounded-b-none"
			on:click={() => {
				togglePane();}}
		>
				{#if collapsed}
				<DoubleArrowUp size={20} class="stroke-1 stroke-white dark:stroke-black" />
				{:else}
				<DoubleArrowDown size={20} class="stroke-1 stroke-white dark:stroke-black" />
				{/if}

            
		</Button>
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
		onCollapse={() => (collapsed = true)}
		onExpand={() => (collapsed = false)}
	>
		<div class="h-full items-center justify-center p-2">
			<StrikesTable />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
