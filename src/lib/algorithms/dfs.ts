function algorithm(matrix: number[][]): number[][] {
	const n = matrix.length;
	let maxPath: number[][] = [];
	let maxValue = -Infinity;

	function findPath(
		x: number,
		y: number,
		currentPath: number[][],
		currentValue: number,
		visited: Set<string>
	) {
		// out of bounds
		if (x < 0 || x >= n || y < 0 || y >= n) {
			return;
		}

		// already visited
		const coordString = `${x},${y}`;
		if (visited.has(coordString)) {
			return;
		}

		// reached the end (n-1, n-1)
		if (x === n - 1 && y === n - 1) {
			if (currentValue > maxValue) {
				maxValue = currentValue;
				// create a copy of the path
				maxPath = [...currentPath, [x, y]];
			}
			return;
		}

		// add point to visited set and path
		visited.add(coordString);
		const newPath = [...currentPath, [x, y]];
		// dont add the value of (0,0)
		const newValue = x !== 0 || y !== 0 ? currentValue + matrix[y][x] : currentValue;

		// explore all directions
		findPath(x + 1, y, newPath, newValue, new Set(visited));
		findPath(x - 1, y, newPath, newValue, new Set(visited));
		findPath(x, y + 1, newPath, newValue, new Set(visited));
		findPath(x, y - 1, newPath, newValue, new Set(visited));
	}

	findPath(0, 0, [], 0, new Set());
	return maxPath;
}

export default algorithm;
