/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="Unit.ts"/>

module RpgGame {

    export class Player extends Unit {
        private playername: string;
        private inventory: InventorySystem;

        private canMove: boolean;

        private playerHealth: number = 40.0;
        private healthText: any;
      
        public getPlayerHealth(): number { return this.playerHealth; }
        public setPlayerHealth(health: number): void { this.playerHealth = health; }


        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, frame?: string | number) {
            //Speler mag altijd als eerste slaan in een battle.
            super(game, 1, 1, x, y, key, 0);

            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;
            this.canMove = true;

            this.inventory = new InventorySystem();
            //base values
           /*  this.strength = 10;
            this.intelligence = 10; */

            //Sprite control
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(1.4);

            //animaties toevoegen vanuit spritesheet. wordt geplitst in preload van mainmenu
            this.animations.add('up', [0, 1, 2]);
            this.animations.add('right', [3, 4, 5]);
            this.animations.add('down', [6, 7, 8]);
            this.animations.add('left', [9, 10, 11]);
            this.animations.add('idle', [7]);

           
        }

        public GetInventory() {
            return this.inventory;
        }

        public GetStrength() {
            return super.getStrength();
        }

        public GetIntelligence() {
            return super.getIntelligence();
        }

        public SetName(name) {
            this.playername = name;
        }

        public SetLevel(level) {
            super.setLevel(level);
        }

        public SetStrength(strength) {
            super.setStrength(strength);
        }

        public SetIntelligence(intelligence) {
            super.setIntelligence(intelligence);
        }

        public getCanPlayerMove() {
            return this.canMove;
        }

        public setCanPlayerMove(canMove) {
            this.canMove = canMove;
        }

        public UpdateStats() {
            this.SetStrength(10);
            this.SetIntelligence(10);
            this.inventory.updateStats();
        }

        update() {

            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.canMove) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                    this.body.velocity.x = -150;
                    this.animations.play('left', 10, true);
                    //this.animations.play('walk');
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                    this.body.velocity.x = 150;
                    this.animations.play('right', 10, true);
                    //this.animations.play('walk');
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.body.velocity.y = -150;
                    this.animations.play('up', 10, true);
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    this.body.velocity.y = 150;
                    this.animations.play('down', 10, true);
                }
                else {
                    this.animations.play('idle', 1, true);
                }
            } else {
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

        }
    }
}