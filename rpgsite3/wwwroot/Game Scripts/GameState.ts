/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

///<reference path='UiBaseState.ts' />

module RpgGame {
    //import Tiled = Phaser.Plugin.Tiled;

    export class GameState extends BaseUiState {
        //* Game Entities

        //* Game Landscape
        private _land: Phaser.Tilemap;
        private _background: Phaser.Sprite;

        //*Game Layers
        private backgroundLayer: Phaser.TilemapLayer;
        private passableLayer: Phaser.TilemapLayer;
        private collisionLayer: Phaser.TilemapLayer;

        //Objects in de map, type unknown.
        private StartPointObject: any;
        private EnterShopPointObject: any;

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
            //this.add.plugin(new Tiled(this.game, this.game.stage));

            //Opslaan van benodigde assets in cachekey.
            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            //Tilemap laden

            /* (<any>this.game.load).tiledmap(cacheKey('myTiledMap', 'tiledmap'), '../sprites/Map/town4.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'townsprite'), '../sprites/tilesets/roguelikeSheet_transparent.png');
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'houses'), '../sprites/tilesets/houses.png'); */
            this.load.tilemap('openworld', '../sprites/Map/town4.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('sprites', '../sprites/tilesets/roguelikeSheet_transparent.png');
            this.game.load.image('hoysesprites','../sprites/tilesets/houses.png');

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
        }

        create(): void {
            //Base ui state
            super.create();

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
            if (speler.x == 0 && speler.y == 0) {
                speler.x = this.StartPointObject.x;
                speler.y = this.StartPointObject.y;
            }

            //physics inladen en koppelen aan speler/layer
            this._land.setCollisionBetween(1, 2000, true, this.collisionLayer);

            this.game.physics.arcade.enable(this.collisionLayer);     
            this.game.physics.arcade.enable(speler);
            speler.body.collideWorldBounds = true;

            //speler inladen in game
            this.game.add.existing(speler);
            this.game.camera.follow(speler);
            speler.visible = true;

            var BattleTestKey = this.input.keyboard.addKey(Phaser.Keyboard.H);
            BattleTestKey.onDown.add(this.CheckForBattleTest, this);

        }

        CheckForBattleTest(): void {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.H)) {
                this.StartBattle();
            }
        }

        StartBattle(): void {
            this.game.state.start('BattleMenu');
        }

        update(): void {
            this.collisionCheck();
        }

        collisionCheck(): void {
            //COLLISION
            this.game.physics.arcade.collide(speler, this.collisionLayer);
        }

        shutdown() {
            this._land.destroy();
            this.world.remove(speler);
        }
    }


}