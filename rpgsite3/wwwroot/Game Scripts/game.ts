/// <reference path="../lib/Phaser/phaser.d.ts"/>

class RpgGame {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    Player: Phaser.Sprite;
    Cursor: Phaser.CursorKeys;

    constructor() {
        this.game = new Phaser.Game(1600, 1600, Phaser.AUTO, 'phaserGame', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        console.log("preload");

        this.game.load.tilemap('level1', '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('Town', '../sprites/tilesets/Town.png');
        this.game.load.image('car', '../sprites/car.png');

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth = 320;
        this.game.scale.minHeight = 260;
        this.game.scale.maxWidth = 1280;
        this.game.scale.maxHeight = 720;

        this.game.scale.setResizeCallback(this.resizeCallBack, this.game);
    }

    render() {

    }
    
    create() {
        this.game.stage.backgroundColor = '#000';

        var map = this.game.add.tilemap('level1');

        this.game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //TileSets toevoegen
        map.addTilesetImage('town', 'Town');

        var backgroundlayer = map.createLayer('Tilelaag 1');
        var roadLayer = map.createLayer('Road');

        

        this.Player = this.game.add.sprite(450, 80, 'car');
        this.Player.anchor.set(0.5, 0.5);

        this.game.physics.arcade.enable(this.Player);

        this.game.camera.follow(this.Player);

        this.Cursor = this.game.input.keyboard.createCursorKeys();
    }

    resizeCallBack() {
        //Hier kan evt. logic als het scherm geresized wordt.

    }

    update() {
        this.Player.body.velocity.x = 0;
        this.Player.body.velocity.y = 0;
        this.Player.body.angularVelocity = 0;

        if (this.Cursor.left.isDown) {
            this.Player.position.x -= 5;
        } else if (this.Cursor.right.isDown) {
            this.Player.position.x += 5;
        }

        if (this.Cursor.up.isDown) {
            this.Player.position.y++;
        } else if (this.Cursor.down.isDown) {
            this.Player.position.y--;
        }
        
    }

}

window.onload = () => {
    var game = new RpgGame();
};