export default function algorithm(matrix: number[][]): number[][] {
	const n = matrix.length;
	let maxValue = -Infinity;
	let maxPath: number[][] = [];

	function findPath(x: number, y: number, value: number, path: number[][], visited: Set<string>) {
		// reached the end
		if (x === n - 1 && y === n - 1) {
			if (value > maxValue) {
				maxValue = value;
				maxPath = [...path, [x, y]];
			}
			return;
		}

		// add point to path and visited set
		const newValue = value + matrix[y][x];
		const newPath = [...path, [x, y]];
		visited.add(`${x},${y}`);

		// next possible steps
		for (const [dx, dy] of [
			[-1, 0],
			[0, 1],
			[1, 0],
			[0, -1]
		]) {
			const nextX = x + dx;
			const nextY = y + dy;

			// out of bounds
			if (nextX < 0 || nextX >= n || nextY < 0 || nextY >= n) {
				continue;
			}

			// already visited
			if (visited.has(`${nextX},${nextY}`)) {
				continue;
			}

			// explore promising direction
			findPath(nextX, nextY, newValue, newPath, new Set(visited));
		}
	}

	findPath(0, 0, 0, [], new Set());
	return maxPath;
}
