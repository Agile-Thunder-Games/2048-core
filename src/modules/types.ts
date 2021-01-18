export type Position = {
    x: number;
    y: number;
}

export type Traversal = {
    x: number[];
    y: number[];
}

export type Metadata = {
    score: number;
    bestScore: number | string;
    terminated: boolean;
    over: boolean;
    won: boolean;
}