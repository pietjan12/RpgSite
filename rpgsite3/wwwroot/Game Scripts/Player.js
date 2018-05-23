/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="Unit.ts"/>
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, MaxHealth, x, y, key, frame) {
            var _this = 
            //Speler mag altijd als eerste slaan in een battle.
            _super.call(this, game, 1, 1, MaxHealth, x, y, key, 0) || this;
            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;
            _this.canMove = true;
            _this.moveSpeed = 150;
            _this.inventory = new RpgGame.InventorySystem();
            //base values
            /*  this.strength = 10;
             this.intelligence = 10; */
            //Sprite control
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(2);
            //animaties toevoegen vanuit spritesheet. wordt geplitst in preload van mainmenu
            _this.animations.add('up', [0, 1, 2]);
            _this.animations.add('right', [3, 4, 5]);
            _this.animations.add('down', [6, 7, 8]);
            _this.animations.add('left', [9, 10, 11]);
            _this.animations.add('idle', [7]);
            return _this;
        }
        Player.prototype.GetInventory = function () {
            return this.inventory;
        };
        Player.prototype.GetStrength = function () {
            return _super.prototype.getStrength.call(this);
        };
        Player.prototype.GetIntelligence = function () {
            return _super.prototype.getIntelligence.call(this);
        };
        Player.prototype.SetName = function (name) {
            this.playername = name;
        };
        Player.prototype.SetLevel = function (level) {
            _super.prototype.setLevel.call(this, level);
        };
        Player.prototype.SetStrength = function (strength) {
            _super.prototype.setStrength.call(this, strength);
        };
        Player.prototype.SetIntelligence = function (intelligence) {
            _super.prototype.setIntelligence.call(this, intelligence);
        };
        Player.prototype.getCanPlayerMove = function () {
            return this.canMove;
        };
        Player.prototype.setCanPlayerMove = function (canMove) {
            this.canMove = canMove;
        };
        Player.prototype.UpdateStats = function () {
            this.SetStrength(10);
            this.SetIntelligence(10);
            this.inventory.updateStats();
        };
        Player.prototype.GetHealth = function () {
            return _super.prototype.GetCurrentHealth.call(this);
        };
        Player.prototype.SetHealth = function (health) {
            _super.prototype.SetCurrentHealth.call(this, health);
        };
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            if (this.canMove) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.velocity.x = -150;
                    this.animations.play('left', 10, true);
                    //this.animations.play('walk');
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.velocity.x = this.moveSpeed;
                    this.animations.play('right', 20, true);
                    //this.animations.play('walk');
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.body.velocity.y = -this.moveSpeed;
                    this.animations.play('up', 20, true);
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    this.body.velocity.y = this.moveSpeed;
                    this.animations.play('down', 20, true);
                }
                else {
                    this.animations.play('idle', 1, true);
                }
            }
            else {
                //idle animatie spelen
                this.animations.play('idle', 1, true);
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
    }(RpgGame.Unit));
    RpgGame.Player = Player;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=Player.js.map