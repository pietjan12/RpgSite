/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame {
    export class Unit extends Phaser.Sprite {
        private Portrait: Phaser.Image;
        //private healthBarGroup: Phaser.Group;
        private HealthBitMap: Phaser.BitmapData;
        private HealthBar: Phaser.Sprite;
        private HealthBG: Phaser.Sprite;
        private Priority: number;
        private MaxHealth: number;
        private CurrentHealth: number;
        private Speed: number;
        private level: number;
        private strength: number;
        private intelligence: number;
        private dead: boolean;
        private HurtSound: Phaser.Sound;

        constructor(game: Phaser.Game, priority: number, speed: number, MaxHealth: number, x?: number, y?: number, key?: string, frame?: string | number) {
            super(game, x, y, key, 0);

            this.name = key;
            this.strength = 10;
            this.intelligence = 10;

            this.MaxHealth = MaxHealth;
            this.CurrentHealth = MaxHealth;
            this.dead = false;

            this.Priority = priority;
            this.Speed = speed;

            //this.healthBarGroup = game.add.group();

            this.anchor.setTo(0.5, 0.5);
            this.scale.set(1);
            this.inputEnabled = true;

            this.events.onDestroy.add(this.destroyHealthBar, this);
        }

        //Methodes
        createPortrait(game: Phaser.Game) {
            // create a bordered portrait
            // image head pulled from the spritesheet
            //var imageToAdd = 

            var portrait = game.add.image(0, 0, this.name, 7)
            var border = game.add.graphics(0, 0)
            border.lineStyle(1, 0xffffff)
            border.drawRect(0, 0, portrait.width, portrait.height)
            portrait.addChild(border)
            // scale down
            portrait.width = 70;
            portrait.height = 70;

            // we want to show their priority number
            // style the text with a translucent background fill
            let style = { font: "20px Arial", fill: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.8)" }
            let text = game.add.text(0, 0, this.Priority.toString(), style)

            // don't scale with the portrait
            text.setScaleMinMax(1, 1);
            // and show it to the top left
            text.anchor.set(0);
            portrait.addChild(text);

            // storing references
            (portrait as any).text = text;
            this.Portrait = portrait
        }

        attack() {

            /* 
            this.scale.x *= 1.75;
            this.scale.y *= 1.75;

            this.x = this.game.world.centerX
            */
            //Speel attack animatie
        }

        hurt() /* blood als parameter */
        {

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
        }

        CreateHealthBar(game: Phaser.Game) {
            var xValue: number;
            var yValue: number;

            if (this.name === "Player") {
                xValue = this.x - 50;
                yValue = this.y - 140;
            } else {
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
        }

        UpdateHealthBar() {
            var percentage = (100 * this.CurrentHealth) / this.MaxHealth;
            this.HealthBitMap.clear();
            this.HealthBitMap.ctx.beginPath();
            this.HealthBitMap.ctx.rect(0, 0, this.HealthBitMap.width, this.HealthBitMap.height);
            this.HealthBitMap.ctx.fillStyle = '#ff0000';
            this.HealthBitMap.ctx.fillRect(0, 0, percentage, 20);
        }

        destroyHealthBar() {
            // this.healthBarGroup.destroy();
            this.HealthBG.destroy();
            this.HealthBar.destroy();
        }

        //Get & Setters
        GetPriority() {
            return this.Priority;
        }

        SetPriority(priority) {
            this.Priority = priority;
        }

        setStrength(strength) {
            this.strength = strength;
        }

        getStrength() {
            return this.strength;
        }

        setIntelligence(intelligence) {
            this.intelligence = intelligence;
        }

        getIntelligence() {
            return this.intelligence;
        }

        setLevel(level) {
            this.level = level;
        }

        getLevel() {
            return this.level;
        }

        setSpeed(speed) {
            this.Speed = speed;
        }

        getSpeed() {
            return this.Speed;
        }

        getPortrait() {
            return this.Portrait;
        }

        SetCurrentHealth(Health) {
            if (Health >= this.maxHealth) {
                this.CurrentHealth = this.maxHealth;
            } else if (Health <= 0) {
                this.CurrentHealth = 0;
                this.dead = true;
            } else {
                this.CurrentHealth = Health;
            }
        }

        getDead() {
            return this.dead;
        }

        GetCurrentHealth() {
            return this.CurrentHealth;
        }
    }
}