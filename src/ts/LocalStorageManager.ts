export class LocalStorageManager {
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

    public get bestScore() : string | number {
        return this.storage.getItem(this.bestScoreKey) || 0;
    }

    public set bestScore(value : string | number) {
        this.storage.setItem(this.bestScoreKey, value.toString());
    }

    public get gameState() : any {
        let stateJSON: string = this.storage.getItem(this.gameStateKey);

        if(stateJSON) {
            return JSON.parse(stateJSON);
        } else {
            return null;
        }
    }

    public set gameState(value: any) {
        this.storage.setItem(this.gameStateKey, JSON.stringify(value));
    }
}
