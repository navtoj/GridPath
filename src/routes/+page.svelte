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
	import algorithm from '$lib/algorithm';
	import Shuffle from '@lucide/svelte/icons/shuffle';

	const grid = {
		min: 2,
		max: 6,
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
	let path: number[][] = $derived.by(() => algorithm(matrix));
	let matrixPath: number[][] = $derived.by(() => {
		let result = Array.from({ length: size }, () => Array.from({ length: size }, () => -1));
		let step = 0;
		for (const [x, y] of path) {
			result[y][x] = step++;
		}
		return result;
	});
	let total: number = $derived.by(() => path.reduce((sum, [x, y]) => sum + matrix[y][x], 0));
</script>

<main class="flex h-dvh select-none flex-col gap-3 p-4">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<p class="text-nowrap border border-dashed p-1 px-2.5 text-xl font-semibold">Grid Path</p>
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
			<p class="rounded-none border border-dashed px-2.5 py-1.5 font-medium">{size}</p>
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
		<!-- <div class="flex gap-1.5 border border-dashed p-1.5">
			<Badge
				class="rounded-none border-red-500 text-red-500"
				variant="outline">Negative</Badge
			>
			<Badge
				class="rounded-none border-blue-500 text-blue-500"
				variant="outline">Positive</Badge
			>
		</div> -->
		<div class="flex items-center gap-3">
			<Button
				class="rounded-none"
				variant="outline"
				size="icon"
				href={page.url.href}
				data-sveltekit-reload><Shuffle /></Button
			>
			<p class="flex flex-row gap-2.5 rounded-none border border-dashed px-2.5 py-1.5">
				<span class="font-medium">Steps</span><Separator orientation="vertical" />
				<span class="font-mono">{path.length - 1}</span>
			</p>
			<p class="flex flex-row gap-2.5 rounded-none border border-dashed px-2.5 py-1.5">
				<span class="font-medium">Total</span><Separator orientation="vertical" />
				<span class="font-mono">{total}</span>
			</p>
		</div>
	</header>
	<div class="flex flex-1 flex-col justify-between border border-dashed p-3">
		{#each matrix as row, y}
			<div class="flex items-center justify-between">
				{#each row as cell, x}
					{@const isStart = x === 0 && y === 0}
					{@const isEnd = x === row.length - 1 && y === matrix.length - 1}
					{@const isInPath = matrixPath[y][x] > -1}
					<div
						class="flex items-center justify-center p-4"
						class:border={!isInPath}
						class:border-2={isInPath}
						class:border-red-500={cell < 0 && !isStart && !isEnd}
						class:border-blue-500={cell >= 0 && !isStart && !isEnd}
						class:border-green-500={(isStart || isEnd) && isInPath}
						class:dark:border-green-700={(isStart || isEnd) && isInPath}
						class:bg-green-50={(isStart || isEnd) && isInPath}
						class:dark:bg-green-500={(isStart || isEnd) && isInPath}
					>
						{#if isStart}
							<House class="-m-1 {isInPath ? 'text-green-500 dark:text-black' : ''}" />
						{:else if isEnd}
							<Flag class="-m-1 {isInPath ? 'text-green-500 dark:text-black' : ''}" />
						{:else}
							<p
								class="font-mono font-bold leading-none"
								class:font-bold={isInPath}
								class:text-red-500={cell < 0}
								class:text-blue-500={cell >= 0}
							>
								{cell}
								<!-- {Math.abs(cell)} -->
								<!-- {matrixPath[y][x]} -->
							</p>
						{/if}
					</div>
					{#if x < row.length - 1}
						{@const currentStep = matrixPath[y][x]}
						{@const nextStep = matrixPath[y][x + 1]}
						{@const direction =
							currentStep > -1 && nextStep > -1 && Math.abs(currentStep - nextStep) === 1
								? currentStep < nextStep
									? 1
									: -1
								: 0}
						<div class="flex flex-1 items-center justify-center">
							{#if direction === -1}
								<Separator class="h-0.5 min-w-1 flex-1 bg-green-500" />
								<div
									class="flex items-center justify-center rounded-full border-2 border-green-500 p-1.5"
								>
									<p class="font-mono font-medium leading-none text-green-600">{currentStep}</p>
								</div>
								<Separator class="h-0.5 min-w-1 flex-1 bg-green-500" />
							{:else if direction === 1}
								<Separator class="h-0.5 min-w-1 flex-1 bg-green-500" />
								<div
									class="flex items-center justify-center rounded-full border-2 border-green-500 p-1.5"
								>
									<p class="font-mono font-medium leading-none text-green-600">{nextStep}</p>
								</div>
								<Separator class="h-0.5 min-w-1 flex-1 bg-green-500" />
							{:else}
								<Separator class="min-w-3 flex-1" />
							{/if}
						</div>
					{/if}
				{/each}
			</div>
			{#if y < matrix.length - 1}
				<div class="flex h-full justify-between">
					{#each row as { }, x}
						{@const currentStep = matrixPath[y][x]}
						{@const nextStep = matrixPath[y + 1][x]}
						{@const direction =
							currentStep > -1 && nextStep > -1 && Math.abs(currentStep - nextStep) === 1
								? currentStep < nextStep
									? 1
									: -1
								: 0}
						<div class="flex flex-col items-center justify-center">
							{#if direction === -1}
								<Separator
									class="min-h-1 w-0.5 flex-1 bg-green-500"
									orientation="vertical"
								/>
								<div
									class="flex items-center justify-center rounded-full border-2 border-green-500 p-1.5"
								>
									<!-- class:ml-5={x === 0}
									class:mr-5={x === row.length - 1} -->
									<p class="font-mono font-medium leading-none text-green-600">{currentStep}</p>
								</div>
								<Separator
									class="min-h-1 w-0.5 flex-1 bg-green-500"
									orientation="vertical"
								/>
							{:else if direction === 1}
								<Separator
									class="min-h-1 w-0.5 flex-1 bg-green-500"
									orientation="vertical"
								/>
								<div
									class="flex items-center justify-center rounded-full border-2 border-green-500 p-1.5"
								>
									<!-- class:ml-5={x === 0}
									class:mr-5={x === row.length - 1} -->
									<p class="font-mono font-medium leading-none text-green-600">{nextStep}</p>
								</div>
								<Separator
									class="min-h-1 w-0.5 flex-1 bg-green-500"
									orientation="vertical"
								/>
							{:else}
								<Separator
									class="min-h-3 flex-1 {x === 0 ? 'ml-5' : x === row.length - 1 ? 'mr-5' : ''}"
									orientation="vertical"
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</main>
