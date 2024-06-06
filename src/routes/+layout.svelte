<script lang="ts">
	import '../app.css';
	import socket from '$lib/connection/socket';
	import { dbstatus } from '$lib/stores/dbstatus';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<slot></slot>

<style></style>
