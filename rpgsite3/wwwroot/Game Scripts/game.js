/// <reference path="../lib/Phaser/phaser.d.ts"/>
var RpgGame = (function () {
    function RpgGame() {
        this.game = new Phaser.Game(1600, 1600, Phaser.AUTO, 'phaserGame', {
            preload: this.preload,
            create: this.create
        });
    }
    RpgGame.prototype.preload = function () {
        console.log("preload");
        this.game.load.tilemap('level1', '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('Town', '../sprites/tilesets/Town.png');
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth = 320;
        this.game.scale.minHeight = 260;
        this.game.scale.maxWidth = 1280;
        this.game.scale.maxHeight = 720;
        this.game.scale.setResizeCallback(this.resizeCallBack, this.game);
    };
    RpgGame.prototype.render = function () {
    };
    RpgGame.prototype.create = function () {
        this.game.stage.backgroundColor = '#000';
        var map = this.game.add.tilemap('level1');
        this.game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //TileSets toevoegen
        map.addTilesetImage('town', 'Town');
        var backgroundlayer = map.createLayer('Tilelaag 1');
        var roadLayer = map.createLayer('Road');
        backgroundlayer.resizeWorld();
    };
    RpgGame.prototype.resizeCallBack = function () {
        //Hier kan evt. logic als het scherm geresized wordt.
    };
    return RpgGame;
}());
window.onload = function () {
    var game = new RpgGame();
};
//# sourceMappingURL=game.js.map