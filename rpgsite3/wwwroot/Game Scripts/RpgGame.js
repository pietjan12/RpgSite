var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(aParams) {
            var _this = _super.call(this, aParams.width, aParams.height, aParams.renderer, aParams.parent, aParams.state, aParams.transparent, aParams.antialias, aParams.physicsConfig) || this;
            /* MAIN MENU LADEN */
            _this.state.add('MainMenu', RpgGame.MainMenu, false);
            _this.state.start('MainMenu');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    RpgGame.Game = Game;
})(RpgGame || (RpgGame = {}));
window.onload = function () {
    var game = new RpgGame.Game({
        width: 1920,
        height: 1080,
        renderer: Phaser.AUTO,
        parent: 'phaserGame',
        transparent: false,
        antialias: false
    });
};
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var Tiled = Phaser.Plugin.Tiled;
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this._land = this._background = null;
            this._playerHealthText = null;
            this._Time = new Phaser.Time(this.game);
        };
        GameState.prototype.preload = function () {
            //Phaser tiled toevoegen als plugin.
            this.add.plugin(new Tiled(this.game, this.game.stage));
            //Opslaan van benodigde assets in cachekey.
            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            //Tilemap laden
            this.game.load.tiledmap(cacheKey('myTiledMap', 'tiledmap'), '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
            //Benodigde Tilesets laden.
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'town'), '../sprites/tilesets/Town.png');
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'Car'), '../sprites/car.png');
            //this.game.load.image(cacheKey('myTiledMap', 'layer', 'Tilelaag 1'));
            //this.game.load.image(cacheKey('myTiledMap', 'layer', 'Road'));
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.minWidth = 320;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;
            this._Time.advancedTiming = true;
            this._Time.desiredFps = 60;
            this._Time.fpsMax = 60;
            this._Time.fpsMin = 30;
            this.input.onDown.add(this.GoFull, this);
        };
        GameState.prototype.create = function () {
            //Tilemap toevoegen
            this._land = this.game.add.tiledmap('myTiledMap');
            this.physics.setBoundsToWorld();
            var TileLayer = this._land.layers[0];
            var RoadLayer = this._land.layers[1];
            TileLayer.scale.set(2);
            TileLayer.resizeWorld();
            RoadLayer.scale.set(2);
            RoadLayer.resizeWorld();
            RpgGame.speler.AddToGame(this.game);
            RpgGame.speler.RemoveFromGame();
            RpgGame.speler.AddToGame(this.game);
            RpgGame.speler.visible = true;
            //Speler
            this.camera.follow(RpgGame.speler);
            //Text
            //this._playerHealthText = this.game.add.text(10, 500, "Health: " + this._Player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
        };
        GameState.prototype.update = function () {
            this.collisionCheck();
        };
        GameState.prototype.collisionCheck = function () {
            //COLLISION
        };
        GameState.prototype.shutdown = function () {
            this._land.destroy();
        };
        //Fullscreen Handler
        GameState.prototype.GoFull = function () {
            if (this.scale.isFullScreen) {
                this.scale.stopFullScreen();
            }
            else {
                this.scale.startFullScreen(false);
            }
        };
        return GameState;
    }(Phaser.State));
    RpgGame.GameState = GameState;
})(RpgGame || (RpgGame = {}));
var RpgGame;
(function (RpgGame) {
    var InventorySystem = /** @class */ (function () {
        function InventorySystem() {
            //Array van items
            this.bag = [];
        }
        InventorySystem.prototype.FillInventory = function () {
            this.inventorySlots = document.getElementsByClassName("inventoryslot");
            this.AddEventListeners();
        };
        InventorySystem.prototype.AddEventListeners = function () {
            for (var i = 0; i < this.inventorySlots.length; i++) {
                this.inventorySlots[i].addEventListener('click', function () {
                    console.log("Inventory Slot aangeklikt");
                });
            }
        };
        InventorySystem.prototype.GetInventory = function () {
            return this.bag;
        };
        InventorySystem.prototype.AddItem = function (item) {
            this.bag.push(item);
        };
        InventorySystem.prototype.RemoveItem = function (item) {
            //Index zoeken en item verwijderen
            var index = this.bag.indexOf(item);
            if (index > -1) {
                this.bag.splice(index, 1);
            }
        };
        return InventorySystem;
    }());
    RpgGame.InventorySystem = InventorySystem;
})(RpgGame || (RpgGame = {}));
var RpgGame;
(function (RpgGame) {
    //Basis elementen van een item, rest komt vanuit asp zelf.
    var Item = /** @class */ (function () {
        function Item() {
        }
        return Item;
    }());
    RpgGame.Item = Item;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="../lib/jquery/jquery.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var MainMenu = /** @class */ (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.preload = function () {
            //benodigde assets laden
            this.load.image('titlepage', '../sprites/mainmenu/mainmenubackground.png');
            this.load.image('logo', '../sprites/mainmenu/logo.png');
            this.load.audio('music', '../Media/mainmenu/intro.mp3', true);
            //Scaling goedzetten.
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenTarget = document.getElementById("phaserGame");
            //HTML ELEMENTEN OPVRAGEN
            this.menuDiv = document.getElementById("MainMenu");
            this.musicMuteBtn = document.getElementById("mutebtn");
            this.fullscreenBtn = document.getElementById("fullscreentoggle");
            this.InventoryWrapper = document.getElementById("inventory");
        };
        MainMenu.prototype.create = function () {
            //Achtergrond en logo toevoegen
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, 0, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            //Muziek toevoegen
            this.music = this.add.audio('music', 1, false);
            this.music.play();
            //Achtergrond langzaam in het scherm brengen.
            var fadeInBackground = this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Default, true);
            //Menu laten zien zodra achtergrond animatie klaar is
            fadeInBackground.onComplete.addOnce(this.ShowMenu, this);
            //Logo animeren
            this.add.tween(this.logo).to({ y: 250 }, 1500, Phaser.Easing.Default, true);
            //Input regelen
            //this.playBtn.addEventListener('click', this.fadeOut.bind(this));
            this.musicMuteBtn.addEventListener('click', this.ToggleMusic.bind(this));
            this.fullscreenBtn.addEventListener('click', this.ToggleFullScreen.bind(this));
            var inventoryKey = this.input.keyboard.addKey(Phaser.Keyboard.I);
            inventoryKey.onDown.add(this.ToggleInventory, this);
            var equipmentKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
            equipmentKey.onDown.add(this.ToggleEquipment, this);
            //Speler initaliseren
            /*  speler = new Player(this.game, this.world.centerX, 350)
              speler.visible = false; */
            this.addInputListeners();
            //ONCLICK VAN EEN VAN DE CHARACTERS DEZE FUNCTIE UITVOEREN ZODAT UI ELEMENTEN GEKOPPELD WORDEN AAN ONCLICK
            //speler.GetInventory().FillInventory();
        };
        MainMenu.prototype.addInputListeners = function () {
            /* document.body.addEventListener('click', function (e) {
                 if (e.srcElement.className == "gamecharacter") {
                     var naam = e.srcElement.children[0];
                     var level = e.srcElement.children[1];
 
                     //Speler naam en level goedzetten
                     speler.SetName(naam.textContent);
                     speler.SetLevel(level.textContent);
 
                     
                 }
             }); */
            document.body.addEventListener('click', this.SetPlayerVariables.bind(this));
        };
        MainMenu.prototype.SetPlayerVariables = function (e) {
            if (e.srcElement.className == "gamecharacter") {
                //Speler initialiseren
                RpgGame.speler = new RpgGame.Player(this.game, this.game.world.centerX, 350);
                //speler.visible = false;
                var naam = e.srcElement.children[0];
                var level = e.srcElement.children[1];
                //Speler naam en level goedzetten
                RpgGame.speler.SetName(naam.textContent);
                RpgGame.speler.SetLevel(level.textContent);
                this.HideMenu();
                this.fadeOut();
            }
        };
        MainMenu.prototype.ToggleInventory = function () {
            this.InventoryWrapper.classList.toggle("hidden");
        };
        MainMenu.prototype.ToggleEquipment = function () {
            //this.EquipmentWrapper.classList.toggle("hidden");
        };
        MainMenu.prototype.HideMenu = function () {
            this.menuDiv.classList.add("hidden");
        };
        MainMenu.prototype.ShowMenu = function () {
            this.menuDiv.classList.remove("hidden");
        };
        MainMenu.prototype.ToggleFullScreen = function () {
            if (this.scale.isFullScreen) {
                this.scale.stopFullScreen();
            }
            else {
                this.scale.startFullScreen(false);
            }
        };
        MainMenu.prototype.ToggleMusic = function () {
            if (this.music.isPlaying) {
                this.music.pause();
            }
            else {
                this.music.resume();
            }
        };
        MainMenu.prototype.fadeOut = function () {
            var tween = this.game.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
            //tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            //Muziek stopzetten.
            this.music.stop();
            //Spel opstarten
            this.game.state.add('GameState', RpgGame.GameState, false);
            this.game.state.start('GameState');
        };
        return MainMenu;
    }(Phaser.State));
    RpgGame.MainMenu = MainMenu;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var playerStates;
    (function (playerStates) {
        playerStates[playerStates["ALIVE"] = 0] = "ALIVE";
        playerStates[playerStates["HIT"] = 1] = "HIT";
        playerStates[playerStates["DEAD"] = 2] = "DEAD";
    })(playerStates = RpgGame.playerStates || (RpgGame.playerStates = {}));
    var lookingDirection;
    (function (lookingDirection) {
        lookingDirection[lookingDirection["LEFT"] = 0] = "LEFT";
        lookingDirection[lookingDirection["RIGHT"] = 1] = "RIGHT";
        lookingDirection[lookingDirection["DOWN"] = 2] = "DOWN";
        lookingDirection[lookingDirection["UP"] = 3] = "UP";
    })(lookingDirection = RpgGame.lookingDirection || (RpgGame.lookingDirection = {}));
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        /*  private walkingSpeed: number = 100.0;
          private isCollidingWithTerrain: boolean = false;
          private playerHealth: number = 40.0;
          private healthText: any;
          private currentState: any;
          private currentLookingDirection: any;
          private isHitting: boolean = false;
          private hitCountdown: number = 20.0;
  
          private playerAnimations: Phaser.Animation[] = [];
  
          public getStatusCollideWithTerrain(): boolean { return this.isCollidingWithTerrain; }
          public setStatusCollideWithTerrain(collide: boolean): void { this.isCollidingWithTerrain = collide; }
  
          public getPlayerHealth(): number { return this.playerHealth; }
          public setPlayerHealth(health: number): void { this.playerHealth = health; }
  
          public getCurrentState(): any { return this.currentState; }
          public setCurrentState(state: any): void { this.currentState = state; } */
        function Player(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'player', 0) || this;
            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;
            //Sprite control
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(2);
            return _this;
        }
        Player.prototype.AddToGame = function (game) {
            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);
        };
        Player.prototype.RemoveFromGame = function () {
            this.destroy();
        };
        Player.prototype.GetInventory = function () {
            return this.inventory;
        };
        Player.prototype.SetName = function (name) {
            this.playername = name;
        };
        Player.prototype.SetLevel = function (level) {
            this.level = level;
        };
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -150;
                //this.animations.play('walk');
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
                //this.animations.play('walk');
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.velocity.y = -150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.velocity.y = 150;
            }
            else {
                //this.animations.frame = 0;
            }
            //Collision check
            //Acties
            /* if (!this.isHitting && this.currentState != playerStates.HIT) {
                this.movement();
            }

            //Gehit enzo implementeren

            this.game.world.wrap(this, 16);

            //Levensstatus bijhouden.
            if(this.playerHealth <= 0) {
                this.currentState = playerStates.DEAD;
                this.kill();
            }
             */
        };
        return Player;
    }(Phaser.Sprite));
    RpgGame.Player = Player;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=RpgGame.js.map