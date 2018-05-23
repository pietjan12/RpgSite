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
    var Unit = (function (_super) {
        __extends(Unit, _super);
        function Unit(game, priority, speed, MaxHealth, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, 0) || this;
            _this.name = key;
            _this.strength = 10;
            _this.intelligence = 10;
            _this.MaxHealth = MaxHealth;
            _this.CurrentHealth = MaxHealth;
            _this.dead = false;
            _this.Priority = priority;
            _this.Speed = speed;
            //this.healthBarGroup = game.add.group();
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(1);
            _this.inputEnabled = true;
            _this.events.onDestroy.add(_this.destroyHealthBar, _this);
            return _this;
        }
        //Methodes
        Unit.prototype.createPortrait = function (game) {
            // create a bordered portrait
            // image head pulled from the spritesheet
            //var imageToAdd = 
            var portrait = game.add.image(0, 0, this.name, 7);
            var border = game.add.graphics(0, 0);
            border.lineStyle(1, 0xffffff);
            border.drawRect(0, 0, portrait.width, portrait.height);
            portrait.addChild(border);
            // scale down
            portrait.width = 70;
            portrait.height = 70;
            // we want to show their priority number
            // style the text with a translucent background fill
            var style = { font: "20px Arial", fill: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.8)" };
            var text = game.add.text(0, 0, this.Priority.toString(), style);
            // don't scale with the portrait
            text.setScaleMinMax(1, 1);
            // and show it to the top left
            text.anchor.set(0);
            portrait.addChild(text);
            // storing references
            portrait.text = text;
            this.Portrait = portrait;
        };
        Unit.prototype.attack = function () {
            /*
            this.scale.x *= 1.75;
            this.scale.y *= 1.75;

            this.x = this.game.world.centerX
            */
            //Speel attack animatie
        };
        Unit.prototype.hurt = function () {
            /*
            // almost double up their size
            // note that we are not setting them, but instead multiplying them to the existing value
            this.scale.x *= 1.75
            this.scale.y *= 1.75
            // start on the center of the game, offset (and some) by the width of the attacker
            this.x = this.game.world.centerX - this.width - 100

            // wait for a bit for the attacker's ATTACK animation to play out a bit
            this.game.time.events.add(300 * ANIM_SPEED, () => {
                // and just about time the attack animation lands it's blow
                // we play the target's HURT animation



                // using the spriter's position
                // we can more or less center the blood effect at the unit's body
                let x = this.x;
                let y = this.y
                blood.position.set(x, y)
                // show the blood effect once
                blood.visible = true
                blood.play('blood', 15 / ANIM_SPEED, false)
            }) */
        };
        Unit.prototype.CreateHealthBar = function (game) {
            var xValue;
            var yValue;
            if (this.name === "Player") {
                xValue = this.x - 50;
                yValue = this.y - 140;
            }
            else {
                xValue = this.x + 150;
                yValue = this.y - 300;
            }
            //Zwarte achtergrond voor healthbar creeren
            var MeterBackGround = game.add.bitmapData(100, 20);
            MeterBackGround.ctx.beginPath();
            MeterBackGround.ctx.rect(0, 0, MeterBackGround.width, MeterBackGround.height);
            MeterBackGround.ctx.fillStyle = '#000000';
            MeterBackGround.ctx.fill();
            //Toevoegen aan de game als sprite
            this.HealthBG = game.add.sprite(xValue, yValue, MeterBackGround);
            var percentage = (100 * this.CurrentHealth) / this.MaxHealth;
            //Rode deel dat health laat zien creeren
            var healthBitMap = game.add.bitmapData(100, 20);
            healthBitMap.ctx.beginPath();
            healthBitMap.ctx.rect(0, 0, healthBitMap.width, healthBitMap.height);
            healthBitMap.ctx.fillStyle = '#ff0000';
            healthBitMap.ctx.fillRect(0, 0, percentage, 20);
            //toevoegen aan game als sprite
            this.HealthBar = game.add.sprite(xValue, yValue, healthBitMap);
            this.HealthBitMap = healthBitMap;
        };
        Unit.prototype.UpdateHealthBar = function () {
            var percentage = (100 * this.CurrentHealth) / this.MaxHealth;
            this.HealthBitMap.clear();
            this.HealthBitMap.ctx.beginPath();
            this.HealthBitMap.ctx.rect(0, 0, this.HealthBitMap.width, this.HealthBitMap.height);
            this.HealthBitMap.ctx.fillStyle = '#ff0000';
            this.HealthBitMap.ctx.fillRect(0, 0, percentage, 20);
        };
        Unit.prototype.destroyHealthBar = function () {
            // this.healthBarGroup.destroy();
            this.HealthBG.destroy();
            this.HealthBar.destroy();
        };
        //Get & Setters
        Unit.prototype.GetPriority = function () {
            return this.Priority;
        };
        Unit.prototype.SetPriority = function (priority) {
            this.Priority = priority;
        };
        Unit.prototype.setStrength = function (strength) {
            this.strength = strength;
        };
        Unit.prototype.getStrength = function () {
            return this.strength;
        };
        Unit.prototype.setIntelligence = function (intelligence) {
            this.intelligence = intelligence;
        };
        Unit.prototype.getIntelligence = function () {
            return this.intelligence;
        };
        Unit.prototype.setLevel = function (level) {
            this.level = level;
        };
        Unit.prototype.getLevel = function () {
            return this.level;
        };
        Unit.prototype.setSpeed = function (speed) {
            this.Speed = speed;
        };
        Unit.prototype.getSpeed = function () {
            return this.Speed;
        };
        Unit.prototype.getPortrait = function () {
            return this.Portrait;
        };
        Unit.prototype.SetCurrentHealth = function (Health) {
            if (Health >= this.maxHealth) {
                this.CurrentHealth = this.maxHealth;
            }
            else if (Health <= 0) {
                this.CurrentHealth = 0;
                this.dead = true;
            }
            else {
                this.CurrentHealth = Health;
            }
        };
        Unit.prototype.getDead = function () {
            return this.dead;
        };
        Unit.prototype.GetCurrentHealth = function () {
            return this.CurrentHealth;
        };
        return Unit;
    }(Phaser.Sprite));
    RpgGame.Unit = Unit;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=Unit.js.map