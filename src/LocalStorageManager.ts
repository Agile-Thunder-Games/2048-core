class LocalStorageManager {
    private bestScoreKey: string;
    private gameStateKey: string;
    private storage: Storage;
    
    public constructor() {
        this.bestScoreKey = "bestScore";
        this.gameStateKey = "gameState";
        this.storage = window.localStorage;
    }

    public getBestScore(): number {
        return this.storage.getItem(this.bestScoreKey) || 0;
    }

    public setBestScore(score: number): void {
        this.storage.setItem(this.bestScoreKey, score.toString());
    }

    public getGameState(): any {
        let stateJSON: string = this.storage.getItem(this.gameStateKey);

        return stateJSON ? JSON.parse(stateJSON) : null;
    }

    public setGameState(gameState: string): void {
        this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
    }

    public clearGameState(): void {
        this.storage.removeItem(this.gameStateKey);
    }
}