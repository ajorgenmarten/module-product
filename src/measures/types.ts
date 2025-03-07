import { measures } from './measures.registry';

export type TMeasureType = 'weight' | 'volume' | 'unity' | 'length';

export type TMeasureAcronym = keyof typeof measures;
