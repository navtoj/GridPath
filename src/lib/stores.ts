import { persisted } from 'svelte-persisted-store';

export const algorithm = persisted<'dfs' | 'aStar'>('algorithm', 'dfs');
