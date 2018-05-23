/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame {
    declare function refreshInventory(): void;

    export class BattleState extends Phaser.State {
        //Turn based queue systeem
        private queue: AttackTurnQueue;
        private queueGroup: any;
        //ENEMY
        private enemies: Unit[];
        private attackingUnit: Unit;
        //Input handelen
        private canAttack: boolean;
        //Damage van gekozen skill van speler opslaan
        private playerDamage: number;
        //DOM ELEMENTEN
        private ActionsDiv: HTMLElement;
        private SkillsDiv: HTMLElement;
        private itemsDiv: HTMLElement;
        private BattleMenu: HTMLElement;
        private AttackBtn: HTMLElement;
        private ItemBtn: HTMLElement;
        private SkipBtn: HTMLElement;
        private FleeBtn: HTMLElement;

        preload() {
            this.game.load.image('bg', '../sprites/backgrounds/battle_background.png');
            this.game.load.audio("attack", "../Media/Battle/attack.mp3");
            this.game.load.audio("hurt", "../Media/Battle/hit.mp3");

            this.BattleMenu = document.getElementById("battlemenu");
            this.ActionsDiv = document.getElementById("actions");
            this.SkillsDiv = document.getElementById("skillslist");
            this.itemsDiv = document.getElementById("itemslist");
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

        }

        create() {
            //speler niet laten bewegen
            speler.setCanPlayerMove(false);

            //scale verhogen
            speler.scale.set(4);

            this.CreateBackground();
            this.CreateEventListeners();
            this.GetEnemies();
            this.ShowPlayer();

            //Battlemenu zichtbaar maken
            this.BattleMenu.classList.remove("hidden");

            var BackToOpenWorldTest = this.input.keyboard.addKey(Phaser.Keyboard.A);
            BackToOpenWorldTest.onDown.add(this.CheckForBackToOpenWorld, this);

            //Speler mag pas aanvallen zodra een skill geselecteerd is.
            this.canAttack = false;
        }

        update() {
            this.enemies.forEach((monster) => {
                monster.tint = 0xffffff;
            });

            if (this.canAttack) {
                //For loop zodat we er makkelijk uit kunnen breken zodra er een gehovert is.
                for (var sprite of this.enemies) {
                    if (sprite.input.pointerOver()) {
                        sprite.tint = 0xff3333;
                        break;
                    }
                }
            }
        }

        shutdown() {
            this.game.stage.backgroundColor = '#000';
            this.BattleMenu.classList.add("hidden");
            this.HideSkills();
            this.HideItems();
            //speler mag weer bewegen
            speler.setCanPlayerMove(true);
            //scaling weer goedzetten van speler.
            speler.scale.set(2);

            this.world.remove(speler);
            this.world.remove(speler.getPortrait());
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
            var startX = 1000;
            var yPosition = 1080 - 150;

            for (var i = 0; i < data.length; i++) {
                //Nextpriority met een omhoog zetten
                nextPriority++;

                //Monster creeren, monsters hebben 50hp elk
                var monster = new Unit(this.game, nextPriority, 1, 50 ,startX, yPosition, "enemy" + data[i].id);
                monster.anchor.set(1, 1);
                //Indien het monster niet de goede kant op kijkt, de sprite flippen, tevens scaled dit de sprite omlaag naar 40% van de normale lengte/breedte.
                
                monster.scale.setTo(-0.6, 0.6);
             
                startX += 250;

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

            //Listeners creeren
            this.CreateMonsterListeners();
        }

        CreateEventListeners() {
            this.AttackBtn.addEventListener('click', this.ShowSkills.bind(this));
            this.ItemBtn.addEventListener('click', this.ShowItems.bind(this));
            this.SkillsDiv.addEventListener('click', this.ChooseSkill.bind(this));
            this.itemsDiv.addEventListener('click', this.ChooseItem.bind(this));
            this.SkipBtn.addEventListener('click', this.HandleSkip.bind(this));
            this.FleeBtn.addEventListener('click', this.HandleFlee.bind(this));
        }

        CreateMonsterListeners() {
            for (var monster of this.enemies) {
                monster.events.onInputDown.add(this.HandlePlayerAttack, this, 0, {target: monster});
            }
        }

        CheckForBackToOpenWorld() {
            this.BackToOpenWorld();
        }

        ShowPlayer() {
            var playerX = 600;
            speler.x = playerX;
            speler.y = 1080 - 300;
            console.log(speler.y);
            this.game.physics.enable(speler, Phaser.Physics.ARCADE);
            this.game.add.existing(speler);
        }

        CreateBackground() {
            this.game.stage.backgroundColor = "#50695A";
            var bg = this.game.add.sprite(0, 0, 'bg');
            //Height verminderen zodat de image niet onder het battle menu komt te vallen.
            bg.height = this.game.height - 66;

            bg.anchor.set(0);
            bg.scale.set(1);
        }

        ShowSkills() {
            this.ActionsDiv.classList.add("hidden");
            this.SkillsDiv.classList.remove("hidden");
        }

        HideSkills() {
            this.SkillsDiv.classList.add("hidden");
            this.ActionsDiv.classList.remove("hidden");
        }

        ShowItems() {
            this.ActionsDiv.classList.add("hidden");
            this.itemsDiv.classList.remove("hidden");
        }

        HideItems() {
            this.itemsDiv.classList.add("hidden");
            this.ActionsDiv.classList.remove("hidden");
        }

        ChooseItem(e) {
            var naam = e.srcElement.innerText;
            var item: Item;
            item = new Item();
            item.SetName(naam);
            speler.GetInventory().UseItem(item);

            this.NextTurn();
        }

        ChooseSkill(e) {
            this.playerDamage = e.srcElement.childNodes[1].innerText;
            this.canAttack = true;
        }

        HandlePlayerAttack(target: Unit) {
            if (this.canAttack) {
                this.canAttack = false;
                this.attackingUnit = this.queue.poll();
                this.attackingUnit.attack();
                this.game.sound.play("attack");

                target.SetCurrentHealth(target.GetCurrentHealth() - this.playerDamage);
                console.log("Target Health : " + target.GetCurrentHealth());
                this.game.sound.play("hurt");
                target.UpdateHealthBar();

                this.CheckForDeath(target);
            }
        }

        HandleAiAttack(attacker: Unit, target: Unit) {
            this.attackingUnit = attacker;
            this.game.sound.play("attack");

            //Random damage genereren voor AI. ai kunnen geen skills gebruiken.
            var damage: number;
            damage = this.game.rnd.integerInRange(0, 20);
            target.SetCurrentHealth(target.GetCurrentHealth() - (attacker.getStrength() + damage));
            console.log("Talk Shit, Get Hit' : Health = " + target.GetCurrentHealth().toString());
            this.game.sound.play("hurt");
            target.UpdateHealthBar();

            this.CheckForDeath(target);
        }

        CheckForDeath(target: Unit) {
            if (target.getDead()) {
                if (target.name == "Player") {
                    this.LostBattle();
                } else {
                    //Monster deleten uit lijst
                    var index: number;
                    index = this.enemies.indexOf(target);
                    this.enemies.splice(index, 1);
                    //Prioriteit verversen van enemies
                    this.enemies.forEach((monster) => {
                        if (monster.GetPriority() > target.GetPriority()) {
                            monster.SetPriority(monster.GetPriority() - 1);
                        }
                    });

                    //Controleren of er nog enemies leven;
                    if (this.enemies.length <= 0) {
                        this.WonBattle();
                    } else {
                        this.NextTurn();
                    }
                }
                //Uit queue verwijderen voor aanvallen
                this.queue.remove(target);
                this.queueGroup.remove(target.getPortrait());
                //Vernietigen.
                target.getPortrait().destroy();
                target.destroy();
            } else {
                this.NextTurn();
            }
        }

        HandleSkip() {
            this.attackingUnit = speler;
            this.NextTurn();
        }

        HandleFlee() {
            this.attackingUnit = speler;

            var randomNumber: number;
            randomNumber = this.game.rnd.integerInRange(0, 100);
            if (randomNumber > 75) {
                //Fleeing successvol, terug naar open wereld.
                this.BackToOpenWorld();
            } else {
                //turn skippen
                this.NextTurn();
            }
        }

        NextTurn() {
            //prioriteit verhogen
            this.attackingUnit.SetPriority(this.attackingUnit.GetPriority() + this.queue.getSize());
            //Divs verbergen
            this.HideSkills();
            this.HideItems();

            this.game.time.events.add(1000 * ANIM_SPEED, () => {
                //na een delay de queue updaten
                this.updateQueue()
            })
        }

        WonBattle() {
            var charactername: string;
            charactername = $("#inventory").find(".gameh1").text().split(" - ")[1];

            $.ajax({
                context: this,
                url: "../Character/generateVictoryItems",
                type: "POST",
                data: { charactername: charactername },
                success: function (data) {
                    if (data === true) {
                        //Nieuwe items gekregen, melding geven aan speler
                        console.log("ITEMS GEKREGEN WOO");
                        //Inventory refreshen
                        refreshInventory();
                    }
                    //Terug naar andere state
                    this.BackToOpenWorld();
                }
            }); 
        }

        LostBattle() {
            this.game.state.start('MainMenu');
        }

        BackToOpenWorld() {
            this.game.state.start('GameState');
        }

        createQueue() {
            this.queue = new AttackTurnQueue();

            //Portraits en healthbars creeren
            speler.createPortrait(this.game);
            speler.CreateHealthBar(this.game);

            this.enemies.forEach((enemy) => enemy.createPortrait(this.game));
            this.enemies.forEach((enemy) => enemy.CreateHealthBar(this.game));

            //speler en enemies toevoegen aan queue
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
            this.queueGroup.x = (this.game.camera.x + (this.game.width / 2)) - totalWidth / 2

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
            if (!this.queue.peek().name.includes('Player')) {
                this.BattleMenu.classList.add("hidden");

                this.HandleAiAttack(this.queue.poll(), speler);
            } else {
                //spelermag aanvallen
                this.BattleMenu.classList.remove("hidden");
            }
        }

        updateVisualQueue() {
            //Queue width etc updaten
            var portraitWidth = this.queueGroup.children[0].width + 5
            var totalWidth = portraitWidth * this.queueGroup.children.length
            //centreren op het scherm op basis van de width
            this.queueGroup.x = (this.game.camera.x + (this.game.width / 2)) - totalWidth / 2


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
                portrait.text.setText(' ' + unit.Priority + ' ')
            }
        }
    }
}