﻿/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame {

    export class BattleState extends Phaser.State {
        //Turn based queue systeem
        private queue: AttackTurnQueue;
        private queueGroup: any;
        //ENEMY
        private enemies: Unit[];
        private attackingUnit: Unit;
        //Input handelen
        private canAttack: boolean;
        //DOM ELEMENTEN
        private BattleMenu: HTMLElement;
        private AttackBtn: HTMLElement;
        private ItemBtn: HTMLElement;
        private SkipBtn: HTMLElement;
        private FleeBtn: HTMLElement;

        preload() {
            this.BattleMenu = document.getElementById("battlemenu");
            this.AttackBtn = document.getElementById("attackbtn");
            this.ItemBtn = document.getElementById("itembtn");
            this.SkipBtn = document.getElementById("skipbtn");
            this.FleeBtn = document.getElementById("fleebtn");
            this.enemies = new Array<Unit>();

            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 320;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;

            this.CreateEventListeners();

            this.GetEnemies();

            this.ShowPlayer();
        }

        create() {
            //Battlemenu zichtbaar maken
            this.BattleMenu.classList.remove("hidden");

            var BackToOpenWorldTest = this.input.keyboard.addKey(Phaser.Keyboard.A);
            BackToOpenWorldTest.onDown.add(this.CheckForBackToOpenWorld, this);

            this.canAttack = true;
        }

        shutdown() {
            this.BattleMenu.classList.add("hidden");
            this.world.remove(speler);
            for (var i = 0; i < this.enemies.length; i++) {
                //Element van wereld en enemies array verwijderen.
                this.enemies.splice(i, 1);
            }
            //Hele state opschonen
            this.world.removeAll();
        }

        GetEnemies() {
            $.ajax({
                url: "../Game/GetRandomMonsters",
                type: "POST",
                data: {},
                success: this.LoadEnemyAssets.bind(this)
            }); 
        }

        LoadEnemyAssets(data) {
            this.game.load.onLoadComplete.addOnce(this.CreateEnemies.bind(this, data), this);

            for (var i = 0; i < data.length; i++) {
                //Asset inladen
                this.game.load.image("enemy" + data[i].id, "../images/exiles/" + data[i].image_url);
            }
            //Laden starten
            this.game.load.start();
            //Callback voor als alle images geladen zijn
            
        }

        CreateEnemies(data) {
            //Variabelen die per loop veranderen
            var nextPriority = speler.GetPriority()
            var startX = this.game.world.centerX + 200;

            for (var i = 0; i < data.length; i++) {
                //Nextpriority met een omhoog zetten
                nextPriority++;
                //Monster creeren
                var monster = new Unit(this.game, nextPriority, 1, startX, this.game.world.centerY, "enemy" + data[i].id);
                monster.anchor.set(1, 1);
                //Indien het monster niet de goede kant op kijkt, de sprite flippen, tevens scaled dit de sprite omlaag naar 40% van de normale lengte/breedte.
                if (monster.name !== "enemy6") {
                    monster.scale.setTo(-0.4, 0.4);
                } else {
                    monster.scale.setTo(0.2, 0.2);
                }
                //Coordinaten waarden omhoog zetten
                startX += 200;
                //Javascript is een goede taal btw haHAA
                var MinimumMultiplier = 5;
                var RandomMultiplier = Math.floor(Math.random() * (speler.getLevel() - MinimumMultiplier + 1)) + MinimumMultiplier;
                //Random stats meegeven
                monster.setLevel(1 * RandomMultiplier);
                monster.setIntelligence(1 * RandomMultiplier);
                monster.setStrength(1 * RandomMultiplier);

                this.enemies.push(monster);
                this.game.add.existing(monster);
            }

            //Queue updaten
            this.createQueue();
            this.updateVisualQueue();
        }

        CreateEventListeners() {
            this.AttackBtn.addEventListener('click', this.HandleAttack.bind(this));
            this.ItemBtn.addEventListener('click', this.HandleItem.bind(this));
            this.SkipBtn.addEventListener('click', this.HandleSkip.bind(this));
            this.FleeBtn.addEventListener('click', this.HandleFlee.bind(this));
        }

        CheckForBackToOpenWorld() {
            this.game.state.start('GameState');
        }

        ShowPlayer() {
            var playerX = this.game.world.centerX - 200;
            speler.x = playerX;
            speler.y = this.game.world.centerY;
            this.game.physics.enable(speler, Phaser.Physics.ARCADE);
            this.game.add.existing(speler);
        }

        HandleAttack(attacker, target) {

        }

        HandleItem() {
        }

        HandleSkip() {

        }

        HandleFlee() {

        }

        createQueue() {
            this.queue = new AttackTurnQueue(function(a, b) {
                // we want the lowest number to go first
                return a.priority - b.priority
            });

            //speler toevoegen
            this.queue.add(speler);

            this.enemies.forEach((enemy) => this.queue.add(enemy));

            //Queue verversen met nieuwe waardes
            this.queue.updateQueue();

            //alle portraits in een queue zetten, zodat we ze gezamelijk kunnen verschuiven
            this.queueGroup = this.add.group()
            this.queueGroup.add(speler.getPortrait());
            this.enemies.forEach((enemy) => this.queueGroup.add(enemy.getPortrait()))

            //Boven in het scherm plaatsen
            this.queueGroup.y = 50

            var portraitWidth = this.queueGroup.children[0].width + 5
            var totalWidth = portraitWidth * this.queueGroup.children.length

            //centreren op het scherm op basis van de width
            this.queueGroup.x = this.world.centerX - totalWidth / 2

            console.log(this.queueGroup);
        }

        updateQueue() {
            //Prioriteit van monsters en spelers updaten.
            this.enemies.forEach((monster) => {
                monster.SetPriority(Phaser.Math.max(1, monster.GetPriority() - monster.getSpeed()));
            })

            speler.SetPriority(Phaser.Math.max(1, speler.GetPriority() - speler.getSpeed()));

           
            //oude attacking unit weer toevoegen
            this.queue.add(this.attackingUnit)
            //queue updaten
            this.queue.updateQueue()
            //visuele queue updaten op scherm
            this.updateVisualQueue()

            //kijken of speler de volgende is
            if (this.queue.peek().name.includes('Player')) {
                //control teruggeven aan speler
                this.canAttack = true;
            } else {
                this.canAttack = false;
                //speler aanvallen.
                this.attackingUnit = this.queue.poll()

                this.HandleAttack(this.attackingUnit, speler);
            } 
        }

        updateVisualQueue() {
            for (var i = 0; i < this.queue.getArray().length; i++) {
                //unit opvragen en portret updaten
                var unit = this.queue.getArray()[i].value;

                var portrait = unit.getPortrait();

                //margin toevoegen om ze uit elkaar te houden
                var posx = i * (portrait.width + 5)
                //animatie toevoegen voor aanpassing
                if (portrait.alpha == 0) {
                    portrait.x = posx
                    this.game.add.tween(portrait).to({ alpha: 1 }, 500 * ANIM_SPEED, Phaser.Easing.Linear.None, true)
                } else {
                    this.game.add.tween(portrait).to({ x: posx }, 300 * ANIM_SPEED, Phaser.Easing.Linear.None, true)
                }

                //Prioriteit nummer weergeven
                portrait.text.setText(' ' + unit.priority + ' ')
            }
        }
    }
}