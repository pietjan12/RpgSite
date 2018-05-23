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
    export declare var ANIM_SPEED: number;

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

            ANIM_SPEED = 1;
            /* STATES TOEVOEGEN */ 
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('GameState', GameState, false);
            this.state.add('BattleMenu', BattleState, false);

            this.state.start('MainMenu');
        }
    }
}

window.onload = () => {
    var game = new RpgGame.Game({
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio,
        renderer: Phaser.AUTO,
        parent: 'phaserGame',
        transparent: false,
        antialias: false
    });
};