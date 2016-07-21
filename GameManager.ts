class GameManager {
    private size: number;
    private inputManager: KeyboardInputManager;
    private storageManager: LocalStorageManager;
    private actuator: HTMLActuator;
    private startTiles: number;
    private over: boolean;
    private won: boolean;
    private _keepPlaying: boolean;
    private grid: Grid;
    private score: number;

    constructor(size: number, InputManager: any, Actuator: any, StorageManager: any) {
        this.size = size; // Size of the grid
        this.inputManager = new InputManager;
        this.storageManager = new StorageManager;
        this.actuator = new Actuator;

        this.startTiles  = 2;

        this.inputManager.on("move", this.move.bind(this));
        this.inputManager.on("restart", this.restart.bind(this));
        this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

        this.setup();
    }

    restart() {
        this.storageManager.clearGameState();
        this.actuator.continueGame(); // Clear the game won/lost message
        this.setup();
    }

    keepPlaying() {
        this._keepPlaying = true;
        this.actuator.continueGame(); // Clear the game won/lost message
    }

    // Return true if the game is lost, or has won and the user hasn't kept playing
    isGameTerminated() {
        return this.over || (this.won && !this._keepPlaying);
    }

    setup() {
        var previousState = this.storageManager.getGameState();

        // Reload the game from a previous game if present
        if (previousState) {
            this.grid        = new Grid(previousState.grid.size, previousState.grid.cells); // Reload grid
            this.score       = previousState.score;
            this.over        = previousState.over;
            this.won         = previousState.won;
            this.keepPlaying = previousState.keepPlaying;
        } else {
            this.grid        = new Grid(this.size);
            this.score       = 0;
            this.over        = false;
            this.won         = false;
            this._keepPlaying = false;

            // Add the initial tiles
           // this.addStartTiles();
        }

        // Update the actuator
        //this.actuate();
    }
}