import random from 'random';

export function createMatrix(n: number, min: number, max: number, seed: number): number[][] {
	random.use(seed);

	// pre-allocate matrix
	let matrix: number[][] = new Array(n);

	// generate random integers
	const randomInts = Array.from({ length: n * n }, () => random.int(min, max));

	// fill matrix rows
	for (let i = 0; i < n; i++) {
		matrix[i] = randomInts.slice(i * n, i * n + n);
	}

	// ensure start/end points are always 0
	matrix[0][0] = 0;
	matrix[n - 1][n - 1] = 0;

	// return 2d array
	return matrix;
}
