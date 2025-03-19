type Position = [number, number];
type Values = { [key: string]: number };

export default class algorithm {
	n: number;
	values: Values;
	start: Position;
	end: Position;
	max_value: number;
	best_path: Position[];

	constructor(matrix: number[][]) {
		this.n = matrix.length;
		let coordinates: Values = {};
		for (let y = 0; y < this.n; y++) {
			for (let x = 0; x < this.n; x++) {
				coordinates[`${x},${y}`] = matrix[y][x];
			}
		}
		this.values = coordinates;
		this.start = [0, 0];
		this.end = [matrix.length - 1, matrix.length - 1];
		this.max_value = -Infinity;
		this.best_path = [];
	}

	private getKey(position: Position): string {
		return `${position[0]},${position[1]}`;
	}

	private getPositionValue(position: Position): number {
		if (
			this.start.toString() === position.toString() ||
			this.end.toString() === position.toString()
		) {
			return 0;
		}
		return this.values[this.getKey(position)] || 0;
	}

	findBestPath(): Position[] {
		const initialPath: Position[] = [this.start];
		const initialVisited: Set<string> = new Set([this.getKey(this.start)]);

		this.dfsWithPruning(this.start, initialPath, initialVisited, 0);

		return this.best_path;
	}

	private dfsWithPruning(
		current: Position,
		path: Position[],
		visited: Set<string>,
		currentValue: number
	) {
		if (current.toString() === this.end.toString()) {
			if (currentValue > this.max_value) {
				this.max_value = currentValue;
				this.best_path = [...path];
			}
			return;
		}

		const directions: Position[] = [
			[-1, 0],
			[0, 1],
			[1, 0],
			[0, -1]
		];
		const nextMoves: [number, Position][] = [];

		for (const [dx, dy] of directions) {
			const nextPos: Position = [current[0] + dx, current[1] + dy];
			const key = this.getKey(nextPos);

			if (
				nextPos[0] >= 0 &&
				nextPos[0] < this.n &&
				nextPos[1] >= 0 &&
				nextPos[1] < this.n &&
				!visited.has(key)
			) {
				const nextValue = this.getPositionValue(nextPos);
				const manhattanDist =
					Math.abs(this.end[0] - nextPos[0]) + Math.abs(this.end[1] - nextPos[1]);
				const priority = nextValue - manhattanDist;
				nextMoves.push([priority, nextPos]);
			}
		}

		nextMoves.sort((a, b) => b[0] - a[0]);

		for (const [_, nextPos] of nextMoves) {
			const positionValue = this.getPositionValue(nextPos);
			const newVisited = new Set(visited);
			newVisited.add(this.getKey(nextPos));

			this.dfsWithPruning(nextPos, [...path, nextPos], newVisited, currentValue + positionValue);
		}
	}
}

// // Example usage
// const n = 5;
// const values: Values = {
// 	'1,1': 2,
// 	'2,2': 3,
// 	'3,3': 4
// };

// const pathfinder = new OptimizedChessboardPathFinder(n, values);
// const [bestPath, maxValue] = pathfinder.findBestPath();
// console.log('Best Path:', bestPath);
// console.log('Max Value:', maxValue);
