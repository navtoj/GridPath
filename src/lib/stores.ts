import { persisted } from 'svelte-persisted-store';

export const algorithm = persisted<'dfs' | 'a*'>('algorithm', 'dfs');
