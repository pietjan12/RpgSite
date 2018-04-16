/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="Unit.ts"/>

module RpgGame {

    export class Player extends Unit {
        private playername: string;
        //private level: number;
        //private strength: number;
        //private intelligence: number;
        //inventory
        private inventory: InventorySystem;

      /*  private walkingSpeed: number = 100.0;
        private isCollidingWithTerrain: boolean = false;
        private playerHealth: number = 40.0;
        private healthText: any;
        private currentState: any;
        private currentLookingDirection: any;
        private isHitting: boolean = false;
        private hitCountdown: number = 20.0;

        private playerAnimations: Phaser.Animation[] = [];

        public getStatusCollideWithTerrain(): boolean { return this.isCollidingWithTerrain; }
        public setStatusCollideWithTerrain(collide: boolean): void { this.isCollidingWithTerrain = collide; }

        public getPlayerHealth(): number { return this.playerHealth; }
        public setPlayerHealth(health: number): void { this.playerHealth = health; }

        public getCurrentState(): any { return this.currentState; }
        public setCurrentState(state: any): void { this.currentState = state; } */


        constructor(game: Phaser.Game, x?: number, y?: number, key?: string, frame?: string | number) {
            //Speler mag altijd als eerste slaan in een battle.
            super(game, 1, 1, x, y, key, 0);

            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;
            

            this.inventory = new InventorySystem();
            //base values
           /*  this.strength = 10;
            this.intelligence = 10; */

            //Sprite control
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(1);

           
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

        public UpdateStats() {
            this.SetStrength(10);
            this.SetIntelligence(10);
            this.inventory.updateStats();
        }

        update() {

            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                this.body.velocity.x = -150;
                //this.animations.play('walk');
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                this.body.velocity.x = 150;
                //this.animations.play('walk');
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.velocity.y = -150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.velocity.y = 150;
            }
            else {
                //this.animations.frame = 0;
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