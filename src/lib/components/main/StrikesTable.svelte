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
	import * as Select from '$lib/components/ui/select';
	import { strikesresult } from '$lib/stores/strikes';
	import { dbstatus } from '$lib/stores/dbstatus';
    

	// Implement isActive (from MainComponent.svelte)
	import { toggleIsActive } from '$lib/functions/toggleIsActive';
	let items;

	$: items = $strikesresult;
	// end of Implement isActive

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

	function handleItemsPerPageChange(event) {
		itemsPerPage = parseInt(event.detail);
		currentPage = 1;
	}

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

	$: paginatedItems = $strikesresult.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function formatDateTime(dateStr) {
		let dateObj = new Date(dateStr);

		let options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
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
			day: 'numeric',
		};

		return dateObj.toLocaleString('id-ID', options);
	}
</script>

<div class="flex h-full flex-col overflow-hidden p-4">
	<div class="mb-2 flex flex-col items-center justify-between sm:flex-row">
		<div class="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-x-2 sm:space-y-0">
			<Button on:click={exportToCSV} class="mt-2 sm:mt-0" variant="default">Export to CSV</Button>

			<button
				type="button"
				tabindex="0"
				aria-haspopup="dialog"
				aria-expanded="true"
				data-state="open"
				id="CFEjs0aSZ6"
				data-melt-popover-trigger=""
				data-popover-trigger=""
				class="inline-flex h-9 w-[300px] items-center justify-start whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-left text-sm font-normal shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
				data-button-root=""
				><svg
					width="24"
					height="24"
					class="mr-2 h-4 w-4"
					role="img"
					aria-label="calendar,"
					viewBox="0 0 15 15"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
						fill="currentColor"
					></path></svg
				> {formatCalendar(firstStrike.time)} - {formatCalendar(latestStrike.time)}</button
			>
		</div>
		<div class="mt-2 flex items-center space-x-2 sm:mt-0">
			<span class="w-full text-sm text-gray-600 dark:text-gray-200 sm:w-auto">
				Latest Strike: {latestStrike ? formatDateTime(latestStrike.time) : 'N/A'}
			</span>
			<span class="flex items-center space-x-1">
				<span class="text-sm text-gray-500">DB:</span>
				<span class="h-3 w-3 rounded-full" style="background-color: {$dbstatus};"></span>
			</span>
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
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
					>Total Items: {$strikesresult.length}</span
				>

				<div class="flex w-auto items-center space-x-1 sm:w-auto">
					<label for="itemsPerPage" class="mr-2 text-sm text-gray-700 dark:text-gray-400"
						>Rows per page:</label
					>
					<Select.Root>
						<Select.Trigger class="w-auto">
							<Select.Value placeholder="10" />
						</Select.Trigger>
						<Select.Content on:change={handleItemsPerPageChange}>
							{#each rowsPerPageOptions as option}
								<Select.Item value={option} selected={option === itemsPerPage}>{option}</Select.Item
								>
							{/each}
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
								<Button class="pl-0 text-left" variant="ghost">Actions</Button>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if !$strikesresult || $strikesresult.length === 0}
							<Table.Row>
								<Table.Cell colspan="4" class="items-center">
									<div class="flex items-center space-x-2">
										<Reload class="mr-2 h-4 w-4 animate-spin" id="reload" />
										<Label for="reload" class="text-lg">Loading Data ...</Label>
									</div>
								</Table.Cell>
							</Table.Row>
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
				</div>
			</div>
		</div>
	{/if}
</div>
