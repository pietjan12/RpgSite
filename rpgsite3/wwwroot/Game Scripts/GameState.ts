/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

///<reference path='UiBaseState.ts' />

module RpgGame {
    import Tiled = Phaser.Plugin.Tiled;

    export class GameState extends BaseUiState {
        //* Game Entities

        //* Game Landscape
        private _land: Phaser.Tilemap;
        private _background: Phaser.Sprite;

        //* Game Text
        private _playerHealthText: Phaser.Text;

        //FPS COUNTER
        private _Time: Phaser.Time;


        init() {
            
            this._land = this._background = null;
            this._playerHealthText = null;
            this._Time = new Phaser.Time(this.game);
        }

        preload() {
            //base Ui state
            super.preload();

            //Phaser tiled toevoegen als plugin.
            this.add.plugin(new Tiled(this.game, this.game.stage));

            //Opslaan van benodigde assets in cachekey.
            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            //Tilemap laden
            (<any>this.game.load).tiledmap(cacheKey('myTiledMap', 'tiledmap'), '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
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
        }

        create(): void {
            //Base ui state
            super.create();

            //Tilemap toevoegen
            this._land = (<any>this.game.add).tiledmap('myTiledMap');

            this.physics.setBoundsToWorld();

            var TileLayer = this._land.layers[0];
            var RoadLayer = this._land.layers[1];
            TileLayer.scale.set(2);
            TileLayer.resizeWorld();
            RoadLayer.scale.set(2);
            RoadLayer.resizeWorld()
            speler.AddToGame(this.game);

            speler.visible = true;
            //Speler
            this.camera.follow(speler);


            //Text
            //this._playerHealthText = this.game.add.text(10, 500, "Health: " + this._Player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
        }

        update(): void {
            this.collisionCheck();
        }

        collisionCheck(): void {
            //COLLISION
        }

        shutdown() {
            this._land.destroy();
        }
    }


}