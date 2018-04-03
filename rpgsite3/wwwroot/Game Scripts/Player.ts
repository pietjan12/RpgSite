/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame {
    export enum playerStates {
      ALIVE,
      HIT,
      DEAD
    }

    export enum lookingDirection {
        LEFT,
        RIGHT,
        DOWN,
        UP
    }

    export class Player extends Phaser.Sprite {
        private playername: string;
        private level: number;
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
            super(game, x, y, 'player', 0);

            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;

            //Sprite control
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(2);

           
        }

        public AddToGame(game: Phaser.Game) {
            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);
        }

        public GetInventory() {
            return this.inventory;
        }

        public SetName(name) {
            this.playername = name;
        }

        public SetLevel(level) {
            this.level = level;
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