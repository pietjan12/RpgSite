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
var RpgGame;
(function (RpgGame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(aParams) {
            var _this = _super.call(this, aParams.width, aParams.height, aParams.renderer, aParams.parent, aParams.state, aParams.transparent, aParams.antialias, aParams.physicsConfig) || this;
            RpgGame.ANIM_SPEED = 1;
            /* STATES TOEVOEGEN */
            _this.state.add('MainMenu', RpgGame.MainMenu, false);
            _this.state.add('GameState', RpgGame.GameState, false);
            _this.state.add('BattleMenu', RpgGame.BattleState, false);
            _this.state.start('MainMenu');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    RpgGame.Game = Game;
})(RpgGame || (RpgGame = {}));
window.onload = function () {
    var game = new RpgGame.Game({
        width: window.screen.width * window.devicePixelRatio,
        height: window.screen.height * window.devicePixelRatio,
        renderer: Phaser.AUTO,
        parent: 'phaserGame',
        transparent: false,
        antialias: false
    });
};
//# sourceMappingURL=game.js.map