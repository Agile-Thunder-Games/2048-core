class LocalStorageManager {
    private bestScoreKey: string;
    private gameStateKey: string;
    private storage: Storage;
    
    public constructor() {
        this.bestScoreKey = "bestScore";
        this.gameStateKey = "gameState";
        this.storage = window.localStorage;
    }

    public clearGameState(): void {
        this.storage.removeItem(this.gameStateKey);
    }

    /*
        Getters and setters
    */
    public get bestScore() : number {
        return this.storage.getItem(this.bestScoreKey) || 0;
    }

    public set bestScore(value : number) {
        this.storage.setItem(this.bestScoreKey, value.toString())
    }
    
    public get gameState() : any {
        let stateJSON: string = this.storage.getItem(this.gameStateKey);

        return stateJSON ? JSON.parse(stateJSON) : null;
    }

    public set gameState(value : any) {
        this.storage.setItem(this.gameStateKey, JSON.stringify(value));
    }
}