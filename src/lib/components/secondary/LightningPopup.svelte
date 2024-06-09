<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { strikesresult } from '$lib/stores/strikes';
    import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
    import * as Alert from '$lib/components/ui/alert';
    import { Badge } from '$lib/components/ui/badge';
    import { toggleIsActive } from '$lib/functions/toggleIsActive';

    let unsubscribe: () => void;
    const secondsToAdd = -1; // For example, add 1 second

    // Define a writable store to hold the current date and time
    const currentDate = writable(new Date());

    // Function to update the current date and time every second
    const updateCurrentDate = () => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + secondsToAdd); // Add the desired number of seconds
        currentDate.set(now);
    };

    // Subscribe to the current date and time store on mount
    onMount(() => {
        unsubscribe = setInterval(updateCurrentDate, 1000); // Update every second
    });

    // Unsubscribe from the current date and time store on destroy
    onDestroy(() => {
        if (unsubscribe) clearInterval(unsubscribe);
    });

    // // Subscribe to strikesresult store to activate latest strikes
    // onMount(() => {
    //     unsubscribe = strikesresult.subscribe((value) => {
    //         const latestStrike = value.slice(-1)[0];
    //         if (latestStrike && new Date(latestStrike.time) > new Date()) {
    //             // Activate the latest strike for 2 seconds
    //             toggleIsActive(latestStrike.id);
    //             setTimeout(() => toggleIsActive(latestStrike.id), 2000); // Deactivate after 2 seconds
    //         }
    //     });
    // });

	$: console.log($strikesresult);
    $: latestStrike = $strikesresult.length ? $strikesresult[$strikesresult.length - 1] : null;

    function formatCalendar(dateStr) {
		let dateObj = new Date(dateStr);

		let options = {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
            hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone: 'Asia/Jakarta',
			timeZoneName: 'short'
		};

		return dateObj.toLocaleString('id-ID', options);
	}

</script>
<!-- 
<div class="alert-area">
    {#each $strikesresult as strike (strike.id)}
        {#if new Date(strike.time) >= $currentDate && !strike.isActive}
            <div in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
                <Alert.Root variant="default" class="m-2 border-opacity-10 bg-opacity-70">
                    <ExclamationTriangle class="h-4 w-4" />
                    <Alert.Title>Latest Strike</Alert.Title>
                    <Alert.Description>
                        {strike.time} - {strike.distance} km - 
                        {#if strike.intensity == 1}
                            <Badge variant="blue">{strike.intensity}</Badge>
                        {:else if strike.intensity > 1 && strike.intensity <= 10}
                            <Badge variant="warning">{strike.intensity}</Badge>
                        {:else}
                            <Badge variant="destructive">{strike.intensity}</Badge>
                        {/if}
                    </Alert.Description>
                </Alert.Root>
            </div>
        {/if}
    {/each}
</div> -->

<!-- we don't need strike.isActive for showing live data -->
<!-- just sort by time -->
<div class="alert-area">
    {#if latestStrike != null}
            <div in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
                <Alert.Root variant="default" class="m-0 border-opacity-10 bg-opacity-70">
                    <ExclamationTriangle class="h-4 w-4" />
                    <Alert.Title>Latest Strike</Alert.Title>
                    <Alert.Description>
                        
                
                        <Badge variant="default">{formatCalendar(latestStrike.time)} </Badge>
                        
                        <Badge variant="secondary">{latestStrike.distance} km</Badge>
                        {#if latestStrike.intensity == 1}
                            <Badge variant="blue">{latestStrike.intensity}</Badge>
                        {:else if latestStrike.intensity > 1 && latestStrike.intensity <= 10}
                            <Badge variant="warning">{latestStrike.intensity}</Badge>
                        {:else}
                            <Badge variant="destructive">{latestStrike.intensity}</Badge>
                        {/if}
                    </Alert.Description>
                </Alert.Root>
            </div>
        {/if}
</div>