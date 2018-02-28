//Reference to phaser js file. Need that autocomplete.
/// <reference path="../lib/Phaser/phaser.js" />

var RpgGame = RpgGame || {};

var game = new Phaser.Game(1600, 1600, Phaser.AUTO, 'phaserGame', { preload: preload, create: create });

function preload() {
    console.log('preload');

    //Tilemap ophalen
    game.load.tilemap('level1', '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
    //Tilesets ophalen
    game.load.image('Town', '../sprites/tilesets/Town.png');

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.scale.setResizeCallback(function () {
        game.scale.setMaximum();
    });
    /*this.load.image('Wild', 'wwwroot/sprites/map/tilesets/Wild.png');
    this.load.image('Wild2', 'wwwroot/sprites/map/tilesets/Wild2.png');
    this.load.image('OtherWild', 'wwwroot/sprites/map/tilesets/OtherWild.png');
    this.load.image('Monsters', 'wwwroot/sprites/map/tilesets/Monsters.png');
    this.load.image('elements', 'wwwroot/sprites/map/tilesets/elements.png');*/
};

function create() {
    console.log('create');
    //Tilemap toevoegen en standaard functionaliteiten instellen.
    
    game.stage.backgroundColor = '#fff';

    var map = game.add.tilemap('level1');

    game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //TileSets toevoegen
    map.addTilesetImage('town', 'Town');

    var backgroundlayer = map.createLayer('Tilelaag 1');
    var roadLayer = map.createLayer('Road');

    backgroundlayer.resizeWorld();
    /*this.map.addTilesetImage('Wild', 'tiles');
    this.map.addTilesetImage('Wild2', 'tiles');
    this.map.addTilesetImage('OtherWild', 'tiles');
    this.map.addTilesetImage('Monsters', 'tiles');
    this.map.addTilesetImage('elements', 'tiles'); */

};
