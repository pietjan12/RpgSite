/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
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
///<reference path='UiBaseState.ts' />
var RpgGame;
(function (RpgGame) {
    //import Tiled = Phaser.Plugin.Tiled;
    var GameState = (function (_super) {
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
            //this.add.plugin(new Tiled(this.game, this.game.stage));
            //Opslaan van benodigde assets in cachekey.
            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            //Tilemap laden
            /* (<any>this.game.load).tiledmap(cacheKey('myTiledMap', 'tiledmap'), '../sprites/Map/town4.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'townsprite'), '../sprites/tilesets/roguelikeSheet_transparent.png');
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'houses'), '../sprites/tilesets/houses.png'); */
            this.load.tilemap('openworld', '../sprites/Map/town4.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('sprites', '../sprites/tilesets/roguelikeSheet_transparent.png');
            this.game.load.image('hoysesprites', '../sprites/tilesets/houses.png');
            //Resolutie regelen
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            //TODO FIXEN DIE SCHIJT
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
            //this._land = (<any>this.game.add).tiledmap('myTiledMap');
            this._land = this.game.add.tilemap('openworld');
            this._land.addTilesetImage('townsprite', 'sprites');
            this._land.addTilesetImage('houses', 'hoysesprites');
            //layers toevoegen
            this.backgroundLayer = this._land.createLayer("Background");
            this.passableLayer = this._land.createLayer("Passable");
            this.collisionLayer = this._land.createLayer('Unpassable');
            //Layer upscalen
            this.backgroundLayer.scale.setTo(2, 2);
            this.passableLayer.scale.setTo(2, 2);
            this.collisionLayer.scale.setTo(2, 2);
            //Spel inzoomen
            this.backgroundLayer.resizeWorld();
            this.passableLayer.resizeWorld();
            this.collisionLayer.resizeWorld();
            this.StartPointObject = this._land.objects["GameObjects"][0];
            this.EnterShopPointObject = this._land.objects["GameObjects"][1];
            //Speler laadt vanuit de main menu, speler inladen op spawnpoint
            if (RpgGame.speler.x == 0 && RpgGame.speler.y == 0) {
                RpgGame.speler.x = this.StartPointObject.x;
                RpgGame.speler.y = this.StartPointObject.y;
            }
            //physics inladen en koppelen aan speler/layer
            this._land.setCollisionBetween(1, 2000, true, this.collisionLayer);
            this.game.physics.arcade.enable(this.collisionLayer);
            this.game.physics.arcade.enable(RpgGame.speler);
            RpgGame.speler.body.collideWorldBounds = true;
            //speler inladen in game
            this.game.add.existing(RpgGame.speler);
            this.game.camera.follow(RpgGame.speler);
            RpgGame.speler.visible = true;
            var BattleTestKey = this.input.keyboard.addKey(Phaser.Keyboard.H);
            BattleTestKey.onDown.add(this.CheckForBattleTest, this);
        };
        GameState.prototype.CheckForBattleTest = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.H)) {
                this.StartBattle();
            }
        };
        GameState.prototype.StartBattle = function () {
            this.game.state.start('BattleMenu');
        };
        GameState.prototype.update = function () {
            this.collisionCheck();
        };
        GameState.prototype.collisionCheck = function () {
            //COLLISION
            this.game.physics.arcade.collide(RpgGame.speler, this.collisionLayer);
        };
        GameState.prototype.shutdown = function () {
            this._land.destroy();
            this.world.remove(RpgGame.speler);
        };
        return GameState;
    }(RpgGame.BaseUiState));
    RpgGame.GameState = GameState;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=GameState.js.map