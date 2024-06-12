<script lang="ts">
	import '../app.css';
	import socket from '$lib/connection/socket';
	import { dbstatus } from '$lib/stores/dbstatus';
	import { ModeWatcher } from 'mode-watcher';
	import { Progress } from '$lib/components/ui/progress';
	import { fade } from 'svelte/transition';

	import { onMount } from 'svelte';

	let isPageLoaded = false;

	let value = 13;
	onMount(() => {
		const timer = setTimeout(() => (value = 100), 200);
		setTimeout(() => {
			isPageLoaded = true;
			console.log('Page is done loading');
			// Execute any other code you want to run when the page has loaded
		}, 500);
		return () => clearTimeout(timer);
	});
</script>

<ModeWatcher />
{#if !isPageLoaded}
	<div transition:fade={{ delay: 150, duration: 200 }} class="flex items-center justify-center h-screen">
		<Progress {value} max={100} class="w-[100%] max-w-xs" />
	</div>
{:else}
	<div transition:fade={{ delay: 450, duration: 300 }}>
		<slot></slot>
	</div>
{/if}

<style></style>
