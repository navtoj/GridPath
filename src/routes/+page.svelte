<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { createMatrix } from '$lib/matrix';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import House from '@lucide/svelte/icons/house';
	import Flag from '@lucide/svelte/icons/flag';

	const grid = {
		min: 2,
		max: 10,
		default: 4
	};
	const value = {
		min: -9,
		max: 9
	};

	let size = $state(
		Math.min(
			Math.max(parseInt(page.url.searchParams.get('size') || `${grid.default}`), grid.min),
			grid.max
		)
	);
	let matrix = $derived.by(() => createMatrix(size, value.min, value.max));
</script>

<div class="flex h-dvh select-none flex-col gap-3 p-4">
	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-1.5">
			<p class="text-nowrap border border-dashed p-1 px-2.5 text-xl font-semibold">Grid Path</p>
			<p class="border border-dashed px-2.5 py-1.5 font-medium">{size}</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="flex gap-1.5">
				<Button
					class="rounded-none"
					variant="outline"
					size="icon"
					disabled={size <= grid.min}
					onclick={() => {
						size = Math.max(grid.min, size - 1);
						goto(`?size=${size}`);
					}}
				>
					<Minus />
				</Button>
				<Button
					class="rounded-none"
					variant="outline"
					size="icon"
					disabled={size >= grid.max}
					onclick={() => {
						size = Math.min(grid.max, size + 1);
						goto(`?size=${size}`);
					}}
				>
					<Plus />
				</Button>
			</div>
			<div class="flex gap-1.5 border border-dashed p-1.5">
				<Badge
					class="rounded-none border-red-500 text-red-500"
					variant="secondary">Negative</Badge
				>
				<Badge
					class="rounded-none border-blue-500 text-blue-500"
					variant="secondary">Positive</Badge
				>
			</div>
		</div>
	</div>
	<div class="flex flex-1 flex-col justify-between border border-dashed p-3">
		{#each matrix as row, y}
			<div class="flex items-center justify-between">
				{#each row as cell, x}
					{@const isStart = x === 0 && y === 0}
					{@const isEnd = x === row.length - 1 && y === matrix.length - 1}
					<div
						class="flex items-center justify-center border p-4"
						class:border-red-500={cell < 0 && !isStart && !isEnd}
						class:border-blue-500={cell >= 0 && !isStart && !isEnd}
					>
						{#if isStart}
							<House class="-m-1" />
						{:else if isEnd}
							<Flag class="-m-1" />
						{:else}
							<p
								class="font-mono leading-none"
								class:text-red-500={cell < 0}
								class:text-blue-500={cell >= 0}
							>
								{Math.abs(cell)}
							</p>
							<!-- aspect-square max-h-fit max-w-fit -->
							<!-- {y * grid.length + 1 + x} -->
						{/if}
					</div>
					{#if x < row.length - 1}
						<Separator class="min-w-3 flex-1" />
					{/if}
				{/each}
			</div>
			{#if y < matrix.length - 1}
				<div class="flex h-full justify-between">
					{#each row as cell, x}
						<Separator
							class="min-h-3 {x === 0 ? 'ml-5' : x === row.length - 1 ? 'mr-5' : ''}"
							orientation="vertical"
						/>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>
