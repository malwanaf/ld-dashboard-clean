<script lang="ts">
    import CalendarIcon from "svelte-radix/Calendar.svelte";
    import {
      CalendarDate,
      DateFormatter,
      type DateValue,
      getLocalTimeZone,
      today
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Button } from "$lib/components/ui/button";
    import { RangeCalendar } from "$lib/components/ui/range-calendar";
    import * as Popover from "$lib/components/ui/popover";
    import { dateRange } from "$lib/stores/dateRange";  // Adjust the import path as needed
    import { filteredItems } from "$lib/stores/filteredItems";
    import Slider from "$lib/components/ui/slider/slider.svelte";
	import { distanceRangeFilter } from "$lib/stores/distanceFilter";
    import { maxDistance } from "$lib/stores/maxDistance";
    import { Radiobutton } from "svelte-radix";
    // Formatter for displaying dates
    const df = new DateFormatter("id-ID", {
      dateStyle: "medium",
    });
  
    // Placeholder for the start value
    let startValue: DateValue | undefined = undefined;
  </script>
  
  <div class="grid gap-2">
    <Popover.Root openFocus>
      <Popover.Trigger asChild let:builder>
        <Button
          variant="outline"
          class={cn(
            "w-auto justify-start text-left font-normal",
            !{$dateRange} && "text-muted-foreground"
          )}
          builders={[builder]}
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {#if $dateRange.start}
            {#if $dateRange.end}
              {df.format($dateRange.start.toDate(getLocalTimeZone()))} - {df.format($dateRange.end.toDate(getLocalTimeZone()))}
            {:else}
              {df.format($dateRange.start.toDate(getLocalTimeZone()))}
            {/if}
          {:else if startValue}
            {df.format(startValue.toDate(getLocalTimeZone()))}
          {:else}
            Pick a date 
          {/if}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <RangeCalendar
          bind:value={$dateRange}
          bind:startValue
          placeholder={$dateRange?.start}
          initialFocus
          numberOfMonths={2}
        />
      </Popover.Content>
    </Popover.Root>
    
  </div>

  <div class="grid gap-2">
    <Popover.Root openFocus>
      <Popover.Trigger asChild let:builder>
        <Button
          variant="outline"
          class={cn(
            "w-auto justify-start text-left font-normal",
            !{$distanceRangeFilter} && "text-muted-foreground"
          )}
          builders={[builder]}
        >
        <Radiobutton class="mr-2 h-4 w-4" />
        {#if $distanceRangeFilter}  
        {$distanceRangeFilter[0]} km - {$distanceRangeFilter[1]} km
        {:else}
        Pick a distance range
        {/if}


        

        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-80 p-4" align="start">
        <div class="flex flex-col w-[100%] items-center gap-2">
          {#if $maxDistance > 0}
          <Slider bind:value={$distanceRangeFilter} max={$maxDistance} step={1} class="max-w-[100%]" />
        {:else}
          <Slider bind:value={$distanceRangeFilter} max={100} step={1} class="max-w-[100%]" />
        {/if}
    </div>
      </Popover.Content>
    </Popover.Root>
    
  </div>
  
  <!-- <div class="flex flex-row w-full items-center gap-2 space-x-2">
    
        <label class="text-sm" for="distance-range">Distance Range :</label>
        <label class="text-sm font-semibold min-w-[13%] max-w-[13%]" for="distance-range"> {$distanceRangeFilter[0]} km - {$distanceRangeFilter[1]} km</label>
    
    
        {#if $maxDistance > 0}
        <Slider bind:value={$distanceRangeFilter} max={$maxDistance} step={1} class="max-w-[30%]" />
      {:else}
        <Slider bind:value={$distanceRangeFilter} max={100} step={1} class="max-w-[30%]" />
      {/if}
  </div> -->

  