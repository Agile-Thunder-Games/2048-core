var fakeStorage = {
  _data: {},

  setItem: function (id: number, val: string) {
    return this._data[id] = String(val);
  },

  getItem: function (id: number) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id: number) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

class LocalStorageManager {
    private bestScoreKey: string;
    private gameStateKey: string;
    private storage: any;
    
    constructor() {
        this.bestScoreKey = "bestScore";
        this.gameStateKey = "gameState";

        var supported: boolean = this.localStorageSupported();
        
        this.storage = supported ? window.localStorage : fakeStorage;
    }

    localStorageSupported(): boolean {
        var testKey = "test";
        var storage = window.localStorage;

        try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            
            return true;
        } catch (error) {
            return false;
        }
    }

    getBestScore(): string {
        return this.storage.getItem(this.bestScoreKey) || 0;
    }

    setBestScore(score: number):void {
        this.storage.setItem(this.bestScoreKey, score);
    }

   getGameState() {
        var stateJSON = this.storage.getItem(this.gameStateKey);

        return stateJSON ? JSON.parse(stateJSON) : null;
    }

    setGameState(gameState: any): void {
        this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
    }

    clearGameState(): void {
        this.storage.removeItem(this.gameStateKey);
    }
}