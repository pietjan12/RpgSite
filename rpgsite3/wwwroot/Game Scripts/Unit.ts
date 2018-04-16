/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame {
    export class Unit extends Phaser.Sprite {
        private Portrait: Phaser.Image;
        private Priority: number;
        private Speed: number;
        private level: number;
        private strength: number;
        private intelligence: number;
        private HeldItems: Item[];

        constructor(game: Phaser.Game, priority: number, speed: number, x?: number, y?: number, key?: string, frame?: string | number) {
            super(game, x, y, key, 0);

            this.name = key;
            this.strength = 10;
            this.intelligence = 10;

            this.Priority = priority;
            this.Speed = speed;

            this.createPortrait(game);

            this.anchor.setTo(0.5, 0.5);
            this.scale.set(1);
        }

        FillInventory(Items) {
            this.HeldItems.push(Items);
        }

        GetPriority() {
            return this.Priority;
        }

        SetPriority(priority) {
            this.Priority = priority;
        }

        createPortrait(game: Phaser.Game) {
            // create a bordered portrait
            // image head pulled from the spritesheet
            var portrait = game.add.image(0, 0, this.name, 'head')
            var border = game.add.graphics(0, 0)
            border.lineStyle(10, 0xffffff)
            border.drawRect(0, 0, portrait.width, portrait.height)
            portrait.addChild(border)
            // scale down
            portrait.width = 70
            portrait.height = 70

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
            this.scale.x *= 1.75;
            this.scale.y *= 1.75;

            this.x = this.game.world.centerX

            //Speel attack animatie

        }

        hurt(blood) {
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
            })
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
    }
}