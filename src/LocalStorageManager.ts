export class LocalStorageManager {
    private bestScoreKey: string;
    private gameStateKey: string;
    private storage: Storage;

    /*private static fakeStorage: any = {
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
    };*/
        
    public constructor() {
        this.bestScoreKey = "bestScore";
        this.gameStateKey = "gameState";
        //this.storage = window.localStorage;

        //let supported = this.localStorageSupported();
        
        this.storage = window.localStorage;
    }

    /*private localStorageSupported(): boolean {
        let testKey: string = "test";
        let storage: Storage = window.localStorage;

        try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);

            return true;
        } catch (error) {
            return false;
        }
    }*/

    public clearGameState(): void {
        this.storage.removeItem(this.gameStateKey);
    }

    public get bestScore() : number {
        return this.storage.getItem(this.bestScoreKey) || 0;
    }

    public set bestScore(value : number) {
        this.storage.setItem(this.bestScoreKey, value.toString());
    }
        
    public get gameState() : any {
        let stateJSON: string = this.storage.getItem(this.gameStateKey); // stateJSON

        //return stateJSON ? JSON.parse(stateJSON) : null;

        if(stateJSON) {
            return JSON.parse(stateJSON);
        } else {
            return null;
        }
    }

    public set gameState(value : any) {
        this.storage.setItem(this.gameStateKey, JSON.stringify(value));
    }
}