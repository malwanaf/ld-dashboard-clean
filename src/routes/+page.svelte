<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import StrikesTable from '$lib/components/main/StrikesTable.svelte';
	import StrikesMap from '$lib/components/main/StrikesMap.svelte';
  </script>
   
  <Resizable.PaneGroup
    direction="vertical"
    class="min-h-screen max-w-screen"
  >
    <Resizable.Pane defaultSize={100}>
      <div class="flex h-full items-center justify-center p-0">
        <StrikesMap />
      </div>
    </Resizable.Pane>
    <Resizable.Handle withHandle />
    <Resizable.Pane defaultSize={0}>
      <div class="p-2 h-full items-center justify-center">
        <StrikesTable />
      </div>
    </Resizable.Pane>
  </Resizable.PaneGroup>