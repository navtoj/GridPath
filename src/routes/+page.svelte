<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { createMatrix } from '$lib/matrix';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import House from '@lucide/svelte/icons/house';
	import Flag from '@lucide/svelte/icons/flag';
	import dfs from '$lib/algorithms/dfs';
	import aStar from '$lib/algorithms/a-star';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import boards from '$lib/boards';
	import { untrack } from 'svelte';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import { algorithm } from '$lib/stores';

	const grid = {
		min: 2,
		max: 5,
		default: 4
	};
	const value = {
		min: -9,
		max: 9
	};

	function getSize(params: URLSearchParams) {
		return Math.min(
			Math.max(
				params.has('size') ? parseInt(params.get('size')!) || grid.default : grid.default,
				grid.min
			),
			grid.max
		);
	}
	function getSeed(params: URLSearchParams, id: string) {
		return params.has('seed')
			? parseInt(params.get('seed')!)
			: parseInt(id.replace(/[a-z]/gi, (char) => `${char.toLowerCase().charCodeAt(0) - 96}`));
	}
	function getBoard(n: number, known: boolean, seed: number) {
		let board = known ? boards.find(({ matrix }) => matrix.length === n) : undefined;
		let matrix = board?.matrix ?? createMatrix(n, value.min, value.max, seed);
		return { matrix, path: board?.path };
	}
	function getPathMatrix(n: number, coordinates: number[][]) {
		let matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => -1));
		let step = 0;
		for (const [x, y] of coordinates) {
			matrix[y][x] = step++;
		}
		return matrix;
	}

	let size = $derived(getSize(page.url.searchParams));
	const id = $props.id();
	let seed = $derived(getSeed(page.url.searchParams, id));
	let board = $derived.by(() =>
		getBoard(size, !untrack(() => page.url.searchParams).has('seed'), seed)
	);
	let path = $derived.by(() => {
		if ($algorithm === 'dfs') {
			return dfs(board.matrix);
		} else if ($algorithm === 'aStar') {
			return aStar(board.matrix);
		} else {
			return [];
		}
	});
	let pathMatrix = $derived.by(() =>
		getPathMatrix(
			untrack(() => size),
			path
		)
	);
</script>

<main class="flex h-dvh select-none flex-col gap-3 p-4">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<a
				href="/"
				data-sveltekit-reload={page.url.searchParams.has('size')}
				class:cursor-default={page.url.searchParams.has('size') === false}
				class="text-nowrap border border-dashed p-1 px-2.5 text-xl font-semibold">Grid Path</a
			>
			<Button
				class="rounded-none"
				variant="outline"
				size="icon"
				disabled={size <= grid.min}
				onclick={() => {
					page.url.searchParams.delete('seed');
					page.url.searchParams.set('size', Math.max(grid.min, size - 1).toString());
					goto('?' + page.url.searchParams.toString());
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
					page.url.searchParams.delete('seed');
					page.url.searchParams.set('size', Math.min(grid.max, size + 1).toString());
					goto('?' + page.url.searchParams.toString());
				}}
			>
				<Plus />
			</Button>
			<Button
				class="rounded-none"
				variant="outline"
				onclick={() => {
					page.url.searchParams.set('seed', `${seed + 1}`);
					goto('?' + page.url.searchParams.toString());
				}}><Shuffle />Shuffle</Button
			>
		</div>
		<div class="flex items-center gap-3">
			{#if board.path}
				{@const isCorrect = path
					.map(([x, y]) => y * board.matrix.length + x + 1)
					.every((position) => board.path?.includes(position))}
				<div class="flex flex-row rounded-none border border-dashed px-2.5 py-1.5">
					<CheckCheck class={[!isCorrect && 'text-muted']} />
				</div>
			{/if}
			<RadioGroup.Root
				class="grid-flow-col gap-0 border border-dashed"
				orientation="horizontal"
				required
				bind:value={$algorithm}
			>
				<div class="flex items-center pl-2.5 {[$algorithm === 'dfs' && 'bg-muted']}">
					<RadioGroup.Item
						value="dfs"
						id="dfs"
					/>
					<Label
						class="ml-0 inline-flex h-full cursor-pointer items-center p-2.5"
						for="dfs">DFS</Label
					>
				</div>
				<div class="flex items-center pl-2.5 {[$algorithm === 'aStar' && 'bg-muted']}">
					<RadioGroup.Item
						value="aStar"
						id="aStar"
					/>
					<Label
						class="ml-0 inline-flex h-full cursor-pointer items-center p-2.5"
						for="aStar">A*</Label
					>
				</div>
			</RadioGroup.Root>
			{#snippet tile(label: string, data: number)}
				<p class="flex flex-row divide-x rounded-none border border-dashed px-2.5 py-1.5">
					<span class="pr-2.5 font-medium">{label}</span>
					<span class="pl-2.5 font-mono">{data.toString().padStart(2, '0')}</span>
				</p>
			{/snippet}
			{@render tile('Steps', path.length - 1)}
			{@render tile(
				'Total',
				path.reduce((sum, [x, y]) => sum + board.matrix[y][x], 0)
			)}
		</div>
	</header>
	<div class="flex flex-1 flex-col justify-between border border-dashed p-3">
		{#each board.matrix as row, y}
			{#snippet pathTile(value: number)}
				<div class="flex items-center justify-center rounded-full border-2 border-green-500 p-1.5">
					<p class="font-mono font-medium leading-none text-green-600">{value}</p>
				</div>
			{/snippet}
			<div class="flex items-center justify-between">
				{#each row as cell, x}
					{@const isStart = x === 0 && y === 0}
					{@const isEnd = x === row.length - 1 && y === row.length - 1}
					{@const isInPath = pathMatrix[y][x] > -1}
					<div
						class="flex items-center justify-center p-4 {isInPath ? 'border-2' : 'border'} {[
							isInPath &&
								(isStart || isEnd) &&
								'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950/50'
						]} {[!(isStart || isEnd) && (cell < 0 ? 'border-red-500' : 'border-blue-500')]}"
					>
						{#if isStart}
							<House class="-m-1 {[isInPath && 'text-green-500']}" />
						{:else if isEnd}
							<Flag class="-m-1 {[isInPath && 'text-green-500']}" />
						{:else}
							<p
								class="font-mono font-bold leading-none"
								class:font-bold={isInPath}
								class:text-red-500={cell < 0}
								class:text-blue-500={cell >= 0}
							>
								<!-- {Math.abs(cell)} -->
								{cell}
								<!-- {pathMatrix[y][x]} -->
								<!-- {x}, {y} -->
								<!-- {y * row.length + x + 1} -->
							</p>
						{/if}
					</div>
					{#if x < row.length - 1}
						{@const currentStep = pathMatrix[y][x]}
						{@const nextStep = pathMatrix[y][x + 1]}
						{@const directionX =
							currentStep > -1 && nextStep > -1 && Math.abs(currentStep - nextStep) === 1
								? currentStep < nextStep
									? 1
									: -1
								: 0}
						<div class="flex flex-1 items-center justify-center">
							{#snippet stepX(step: number)}
								{#snippet separatorX()}
									<Separator class="h-0.5 min-w-1 flex-1 bg-green-500" />
								{/snippet}
								{@render separatorX()}
								{@render pathTile(step)}
								{@render separatorX()}
							{/snippet}
							{#if directionX === -1}
								{@render stepX(currentStep)}
							{:else if directionX === 1}
								{@render stepX(nextStep)}
							{:else}
								<Separator class="min-w-3 flex-1" />
							{/if}
						</div>
					{/if}
				{/each}
			</div>
			{#if y < row.length - 1}
				<div class="flex h-full justify-between">
					{#each { length: row.length }, x}
						{@const currentStep = pathMatrix[y][x]}
						{@const nextStep = pathMatrix[y + 1][x]}
						{@const directionY =
							currentStep > -1 && nextStep > -1 && Math.abs(currentStep - nextStep) === 1
								? currentStep < nextStep
									? 1
									: -1
								: 0}
						<div class="flex flex-col items-center justify-center">
							{#snippet stepY(step: number)}
								{#snippet separatorY()}
									<Separator
										class="min-h-1 w-0.5 flex-1 bg-green-500"
										orientation="vertical"
									/>
								{/snippet}
								{@render separatorY()}
								{@render pathTile(step)}
								{@render separatorY()}
							{/snippet}
							{#if directionY === -1}
								{@render stepY(currentStep)}
							{:else if directionY === 1}
								{@render stepY(nextStep)}
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
