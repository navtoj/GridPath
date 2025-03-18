// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
function getRandomIntInclusive(min: number, max: number) {
	const lowerBound = Math.ceil(min);
	const upperBound = Math.floor(max);
	return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
}

export function createMatrix(n: number, min: number, max: number): number[][] {
	// generate n rows
	return Array.from({ length: n }, (_, y) =>
		// generate n columns
		Array.from({ length: n }, (_, x) => {
			// ensure start/end points are always 0
			if ((x === 0 && y === 0) || (x === n - 1 && y === n - 1)) {
				return 0;
			} else {
				// generate random integers
				return getRandomIntInclusive(min, max);
			}
		})
	);
}
