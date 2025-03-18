<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher themeColors={{ dark: 'black', light: 'white' }} />

{@render children()}
