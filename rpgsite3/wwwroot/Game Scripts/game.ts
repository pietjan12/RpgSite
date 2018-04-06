/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>


interface IGameConstructor {
    width: string | number,
    height: string | number,
    renderer?: number,
    parent: string,
    state?: any,
    transparent?: boolean,
    antialias?: boolean,
    physicsConfig?: any
}

module RpgGame {
    //Globale variabelen.
    export declare var speler: Player;

    export class Game extends Phaser.Game {

        constructor(aParams: IGameConstructor) {
            super(aParams.width,
                aParams.height,
                aParams.renderer,
                aParams.parent,
                aParams.state,
                aParams.transparent,
                aParams.antialias,
                aParams.physicsConfig);
            /* MAIN MENU LADEN */
            this.state.add('MainMenu', MainMenu, false);
            this.state.start('MainMenu');
        }
    }
}

window.onload = () => {
    var game = new RpgGame.Game({
        width: 1920,
        height: 1080,
        renderer: Phaser.AUTO,
        parent: 'phaserGame',
        transparent: false,
        antialias: false
    });
};