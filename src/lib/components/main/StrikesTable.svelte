<script>
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import Reload from 'svelte-radix/Reload.svelte';
	import { Label } from '$lib/components/ui/label';
	import { mapOfStrikesResult, strikesresult } from '$lib/stores/strikes';
	import { dbstatus } from '$lib/stores/dbstatus';
	import DatePicker from '$lib/components/secondary/DatePicker.svelte';
	import { toggleIsActive } from '$lib/functions/toggleIsActive';
	import { filteredItems, mapFilteredItems } from '$lib/stores/filteredItems';
	import { distanceRangeFilter } from '$lib/stores/distanceFilter';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import * as Select from '$lib/components/ui/select';
	import { writable } from 'svelte/store';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { showedItemsId } from '$lib/stores/showedItems';
	
	
	// Store to keep the selected rows per page value
	const rowsPerPage = writable(10);

	

	let items;
	$: items = $strikesresult;

	let currentPage = 1;
	let itemsPerPage = 10;
	let rowsPerPageOptions = [5, 10, 20, 50];
	let isLoading = false;
	let latestStrike = '';
	let sortBy = 'time';
	let sortOrder = 'ASC';

	$: console.log($dbstatus);
	$: latestStrike = $strikesresult.length ? $strikesresult[$strikesresult.length - 1] : null;
	$: firstStrike = $strikesresult.length ? $strikesresult[0] : null;

	$: if ($rowsPerPage !== itemsPerPage) {
		handleItemsPerPageChange($rowsPerPage);
	}

	// Function to handle items per page change
	function handleItemsPerPageChange(newItemsPerPage) {
		itemsPerPage = newItemsPerPage;
		currentPage = 1;
	}

	$: selectedRows = $rowsPerPage
		? {
				label: $rowsPerPage,
				value: $rowsPerPage
			}
		: undefined;

	function exportToCSV() {
		try {
			if (!$strikesresult.length) {
				console.error('No data to export');
				return;
			}

			const headers = Array.from(new Set($strikesresult.flatMap(Object.keys)));
			const csvContent = [
				headers.join(','),
				...$strikesresult.map((item) =>
					headers
						.map((header) => (item[header] != null ? String(item[header]).replace(/"/g, '""') : ''))
						.join(',')
				)
			].join('\n');

			const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
			const link = document.createElement('a');
			link.setAttribute('href', encodedUri);
			link.setAttribute('download', 'data.csv');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error exporting to CSV:', error);
		}
	}

	function handleSort(column) {
		if (sortBy === column) {
			sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
		} else {
			sortBy = column;
			sortOrder = 'ASC';
		}

		$strikesresult = $strikesresult.slice().sort((a, b) => {
			if (sortOrder === 'ASC') {
				return a[column] > b[column] ? 1 : -1;
			} else {
				return a[column] < b[column] ? 1 : -1;
			}
		});
	}

	$: paginatedItems = $filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);



	function formatDateTime(dateStr) {
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
	function formatCalendar(dateStr) {
		let dateObj = new Date(dateStr);

		let options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};

		return dateObj.toLocaleString('id-ID', options);
	}

	let showAll = false;

	let hideShowToggleState = false;
	
	function hideShowToggle(){
		$showedItemsId = $strikesresult.map((strike) => {
			strike.isActive = !strike.isActive;
			hideShowToggleState = !hideShowToggleState;
			return strike;
			
		});
	}
	$: checkAnyActive = $filteredItems.some((strike) => strike.isActive);
	$: console.log(checkAnyActive);
	function showAllFilteredItems(){
		if($filteredItems.length != 0){
			$strikesresult = $strikesresult.map((strike) => {
			if (checkAnyActive){
				strike.isActive = false;
			}else if (!checkAnyActive){
				strike.isActive = true;
			}
			
			
			
			hideShowToggleState = !hideShowToggleState;
			return strike;
		});
		}
		
	}

</script>

<div class="flex h-full flex-col overflow-hidden p-4">
	<div class="mb-2 flex flex-col items-center justify-between sm:flex-row">
		<div
			class="flex w-full flex-grow flex-col space-y-2 sm:w-auto sm:flex-row sm:space-x-2 sm:space-y-0"
		>
			<Button on:click={exportToCSV} class="mt-2 sm:mt-0" variant="default">Export to CSV</Button>
			<DatePicker />
			
		</div>
		<div class="mt-2 flex items-center space-x-2 sm:mt-0">
			<span class="w-full text-sm text-gray-600 dark:text-gray-200 sm:w-auto">
				Latest Strike: {latestStrike ? formatDateTime(latestStrike.time) : 'N/A'}
			</span>
			<span class="flex items-center space-x-1">
				<span class="text-sm text-gray-500">DB:</span>
				<span class="h-3 w-3 rounded-full" style="background-color: {$dbstatus};"></span>
			</span>
			<Button on:click={toggleMode} variant="outline" size="icon" >
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 "
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>

	{#if isLoading}
		<div class="mt-8 flex flex-grow flex-col items-center justify-center">
			<Reload class="r-2 h-4 w-4 animate-spin" />
			<span class="ml-2 text-gray-900">Loading...</span>
		</div>
	{:else}
		<div class="flex flex-grow flex-col overflow-hidden">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm text-gray-700 dark:text-gray-400"
					>Total Items:
					{#if showAll}
						{$strikesresult.length}
					{:else if !showAll}
						{$filteredItems.length}
					{/if}
				</span>

				<div class="flex w-auto items-center space-x-1 sm:w-auto">
					<label for="itemsPerPage" class="mr-2 text-sm text-gray-700 dark:text-gray-400"
						>Rows per page:</label
					>
					<Select.Root
						selected={selectedRows}
						onSelectedChange={(v) => {
							v && ($rowsPerPage = v.value);
						}}
					>
						<Select.Trigger class="w-auto">
							<Select.Value placeholder="Rows per page" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="10" label="10">10</Select.Item>
							<Select.Item value="20" label="20">20</Select.Item>
							<Select.Item value="50" label="50">50</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="flex-grow overflow-x-auto rounded-md border">
				<Table.Root class="text-md w-full">
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-left">ID</Table.Head>
							<Table.Head class="text-left">
								<Button class="pl-0 text-left" variant="ghost" on:click={() => handleSort('time')}>
									Time<CaretSort class="ml-2 h-4 w-4" />
								</Button>
							</Table.Head>
							<Table.Head class="text-left">
								<Button
									class="pl-0 text-left"
									variant="ghost"
									on:click={() => handleSort('distance')}
								>
									Distance<CaretSort class="h-4 w-4" />
								</Button>
							</Table.Head>
							<Table.Head class="text-center">
								<Button
									class="pl-0 text-left"
									variant="ghost"
									on:click={() => handleSort('intensity')}
								>
									Intensity<CaretSort class="h-4 w-4" />
								</Button>
							</Table.Head>
							<Table.Head class="text-center">
								<Tooltip.Root>
									<Tooltip.Trigger>			
										<Button on:click={showAllFilteredItems} class="pl-0 text-left" variant="ghost">Actions
										</Button>
										</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="text-sm leading-7 [&:not(:first-child)]:mt-6">
											{#if hideShowToggleState || checkAnyActive}
											
											Hide
										{:else}
											Show
										{/if}
										All
									</p>
									</Tooltip.Content>
								  </Tooltip.Root>
								
	
								
									
									
								
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if $filteredItems.length === 0 && !showAll}
							{#if $dbstatus === 'green'}
							<Table.Row>
								<Table.Cell colspan="5" class="items-center">
									<div class="flex items-center space-x-2">
										<Label class="text-lg">No data found</Label>
									</div>
								</Table.Cell>
							</Table.Row>
							{:else if $dbstatus === 'red'}
							<Table.Row>
								<Table.Cell colspan="5" class="items-center">
									<div class="flex items-center space-x-2">
										<Label class="text-lg">Database not Connected</Label>
									</div>
								</Table.Cell>
							</Table.Row>
							{/if}
							
						{/if}

					


						{#if !$strikesresult || $strikesresult.length === 0 && $dbstatus === 'green' && !isLoading}
							<Table.Row>
								<Table.Cell colspan="5" class="items-center">
									<div class="flex items-center space-x-2">
										<Reload class="mr-2 h-4 w-4 animate-spin" id="reload" />
										<Label for="reload" class="text-lg">Loading Data ...</Label>
									</div>
								</Table.Cell>
							</Table.Row>
						{:else if showAll}
							{#each paginatedItems as strike (strike.id)}
								<Table.Row>
									<Table.Cell class="text-left">{strike.id}</Table.Cell>
									<Table.Cell class="text-left">{formatDateTime(strike.time)}</Table.Cell>
									<Table.Cell class="text-left">{strike.distance} km</Table.Cell>
									<Table.Cell class="text-center">{strike.intensity}</Table.Cell>
									<Table.Cell class="text-center">
										<Button class="min-w-20" on:click={() => toggleIsActive(strike.id)}>
											{strike.isActive ? 'Hide' : 'Show'}
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							{#each paginatedItems as strike (strike.id)}
								<Table.Row>
									<Table.Cell class="text-left">{strike.id}</Table.Cell>
									<Table.Cell class="text-left">{formatDateTime(strike.time)}</Table.Cell>
									<Table.Cell class="text-left">{strike.distance} km</Table.Cell>
									<Table.Cell class="text-center">{strike.intensity}</Table.Cell>
									<Table.Cell class="text-center">
										<Button class="min-w-20" on:click={() => toggleIsActive(strike.id)}>
											{strike.isActive ? 'Hide' : 'Show'}
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
			<div class="flex flex-col items-center justify-center">
				<div class="mt-4">
					{#if showAll}
						<Pagination.Root count={$strikesresult.length} perPage={itemsPerPage} let:pages>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.PrevButton
										on:click={() => (currentPage = currentPage - 1)}
										disabled={currentPage === 1}
									/>
								</Pagination.Item>
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<Pagination.Link
												{page}
												on:click={() => (currentPage = page.value)}
												isActive={currentPage == page.value}
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item>
									<Pagination.NextButton
										on:click={() => (currentPage = currentPage + 1)}
										disabled={currentPage === pages.length}
									/>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination.Root>
					{:else}
						<Pagination.Root count={$filteredItems.length} perPage={itemsPerPage} let:pages>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.PrevButton
										on:click={() => (currentPage = currentPage - 1)}
										disabled={currentPage === 1}
									/>
								</Pagination.Item>
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<Pagination.Link
												{page}
												on:click={() => (currentPage = page.value)}
												isActive={currentPage == page.value}
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item>
									<Pagination.NextButton
										on:click={() => (currentPage = currentPage + 1)}
										disabled={currentPage === pages.length}
									/>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination.Root>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
