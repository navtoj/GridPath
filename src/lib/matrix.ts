import random from 'random';

export function createMatrix(n: number, range: number, seed: number): number[][] {
	random.use(seed);

	// pre-allocate rows and columns
	let matrix: number[][] = Array.from({ length: n }, () => Array.from({ length: n }));

	// fill matrix with random integers
	for (let y = 0; y < n; y++) {
		for (let x = 0; x < n; x++) {
			const isRowEven = y % 2 === 0;
			const isColEven = x % 2 === 0;
			// alternate +/- values
			matrix[y][x] = isRowEven === isColEven ? random.int(-range, -1) : random.int(1, range);
		}
	}

	// ensure start/end points are always 0
	matrix[0][0] = 0;
	matrix[n - 1][n - 1] = 0;

	// return 2d array
	return matrix;
}
