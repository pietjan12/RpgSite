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
var RpgGame;
(function (RpgGame) {
    var BaseUiState = /** @class */ (function (_super) {
        __extends(BaseUiState, _super);
        function BaseUiState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseUiState.prototype.preload = function () {
            //ui elementen opvragen
            this.InventoryWrapper = document.getElementById("inventory");
            this.EquipmentWrapper = document.getElementById("equipment");
            this.EscapeMenuWrapper = document.getElementById("escapemenu");
            this.BackToMenuBtn = document.getElementById("backfromgame");
        };
        BaseUiState.prototype.create = function () {
            var inventoryKey = this.input.keyboard.addKey(Phaser.Keyboard.I);
            inventoryKey.onDown.add(this.ToggleInventory, this);
            var equipmentKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
            equipmentKey.onDown.add(this.ToggleEquipment, this);
            var escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            escapeKey.onDown.add(this.ToggleEscapeMenu, this);
            this.BackToMenuBtn.addEventListener('click', this.BackToMenu.bind(this));
        };
        BaseUiState.prototype.ToggleInventory = function () {
            this.InventoryWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.ToggleEquipment = function () {
            this.EquipmentWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.ToggleEscapeMenu = function () {
            this.EscapeMenuWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.BackToMenu = function () {
            //Alle menu's verbergen.
            this.InventoryWrapper.classList.add("hidden");
            this.EquipmentWrapper.classList.add("hidden");
            this.EscapeMenuWrapper.classList.add("hidden");
            this.game.state.start('MainMenu');
        };
        return BaseUiState;
    }(Phaser.State));
    RpgGame.BaseUiState = BaseUiState;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
///<reference path='UiBaseState.ts' />
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
            //base Ui state
            _super.prototype.preload.call(this);
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
        };
        GameState.prototype.create = function () {
            //Base ui state
            _super.prototype.create.call(this);
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
        return GameState;
    }(RpgGame.BaseUiState));
    RpgGame.GameState = GameState;
})(RpgGame || (RpgGame = {}));
var RpgGame;
(function (RpgGame) {
    var InventorySystem = /** @class */ (function () {
        function InventorySystem() {
            //Array van items
            this.bag = [];
            this.ListenForKey = document.onkeydown;
        }
        InventorySystem.prototype.FillInventory = function () {
            this.InventoryWrapper = document.getElementById("inventorywrapper");
            this.inventorySlots = document.getElementsByClassName("gameinventoryitem");
            this.AddEventListeners();
        };
        InventorySystem.prototype.AddEventListeners = function () {
            for (var i = 0; i < this.inventorySlots.length; i++) {
                //ONCLICK
                /* this.inventorySlots[i].addEventListener('click', function () {
                    console.log("Inventory Slot aangeklikt");
                }); */
                //RIGHT CLICK , ACTIONS LATEN ZIEN
                this.inventorySlots[i].addEventListener('contextmenu', this.ShowContextMenu.bind(this));
            }
        };
        InventorySystem.prototype.ShowContextMenu = function (e) {
            //Indien nodig oude contextmenu verbergen
            if (this.ContextMenu != undefined) {
                this.ContextMenu.classList.add("hidden");
            }
            //Contextmenu div opvragen
            var parentDiv = e.target.parentElement || e.srcElement.parentElement;
            this.ContextMenu = parentDiv.getElementsByClassName("context-menu")[0];
            console.log("Right Click");
            e.preventDefault();
            //Contextmenu laten zien
            this.ContextMenu.classList.remove("hidden");
            this.ContextMenu.style.display = 'block';
            this.ContextMenu.style.left = e.offsetX + 10 + 'px';
            //Onclick handelen van opties
            for (var i = 0; i < this.ContextMenu.childElementCount; i++) {
                var item = this.ContextMenu.children[i];
                //ul negeren
                if (item.outerHTML === "ul") {
                }
                else {
                    item.addEventListener('click', this.HandleContextClick.bind(this));
                }
            }
            return false;
        };
        InventorySystem.prototype.HandleContextClick = function (e) {
            var item = e.target || e.srcElement;
            console.log("Clicked : " + item.className);
            //Context menu verbergen
            this.HideContextMenu();
        };
        InventorySystem.prototype.HideContextMenu = function () {
            this.ContextMenu.classList.add("hidden");
            //var keycode = 
            this.ContextMenu.style.display = 'none';
        };
        InventorySystem.prototype.ListenForKey = function (e) {
            var keycode = e.which || e.keyCode;
            if (keycode == 27) {
                this.HideContextMenu();
            }
            this.HideContextMenu();
        };
        InventorySystem.prototype.GetInventory = function () {
            return this.bag;
        };
        InventorySystem.prototype.EquipItem = function (item) {
            console.log("equip item");
        };
        InventorySystem.prototype.UseItem = function (item) {
            console.log("use item");
            //this.bag.push(item);
            //Inventory onclick updaten.
            //this.FillInventory();
        };
        InventorySystem.prototype.RemoveItem = function (item) {
            //Index zoeken en item verwijderen
            /*  var index = this.bag.indexOf(item);
              if (index > -1) {
                  this.bag.splice(index, 1);
              }
              //Inventory onclick updaten
              this.FillInventory(); */
            console.log("remove item");
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
        Item.prototype.SetName = function (name) {
            this.name = name;
        };
        Item.prototype.SetDescription = function (description) {
            this.description = description;
        };
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
            this.characterMenuDiv = document.getElementById("CharacterMenu");
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
            //Speler initaliseren
            /*  speler = new Player(this.game, this.world.centerX, 350)
              speler.visible = false; */
            this.addInputListeners();
            //ONCLICK VAN EEN VAN DE CHARACTERS DEZE FUNCTIE UITVOEREN ZODAT UI ELEMENTEN GEKOPPELD WORDEN AAN ONCLICK
            //speler.GetInventory().FillInventory();
        };
        MainMenu.prototype.addInputListeners = function () {
            document.body.addEventListener('click', this.SetPlayerVariables.bind(this));
        };
        MainMenu.prototype.SetPlayerVariables = function (e) {
            var target = e.target.className || e.srcElement.className;
            if (target == "gamecharacter") {
                //Speler initialiseren
                RpgGame.speler = new RpgGame.Player(this.game, this.game.world.centerX, 350);
                window.player = RpgGame.speler;
                //speler.visible = false;
                var naam = e.target.children[0] || e.srcElement.children[0];
                var level = e.target.children[1] || e.srcElement.children[1];
                //Speler naam en level goedzetten
                RpgGame.speler.SetName(naam.textContent);
                RpgGame.speler.SetLevel(level.textContent);
                this.fadeOut();
            }
        };
        MainMenu.prototype.HideMenu = function () {
            this.menuDiv.classList.add("hidden");
        };
        MainMenu.prototype.ShowMenu = function () {
            //Indien we terug van de game komen, alle originele knoppen zichtbaar maken.
            this.menuDiv.children[0].classList.remove("hidden");
            this.menuDiv.children[1].classList.remove("hidden");
            this.menuDiv.children[2].classList.remove("hidden");
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
            //Charactermenu verbergen
            this.characterMenuDiv.classList.add("hidden");
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
            _this.inventory = new RpgGame.InventorySystem();
            //Sprite control
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(2);
            return _this;
        }
        Player.prototype.AddToGame = function (game) {
            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);
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