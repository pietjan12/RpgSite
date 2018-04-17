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
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var defaultcomparator = function (a, b) {
        return a < b ? -1 : (a > b ? 1 : 0);
    };
    /*  SOURCE VOOR QUEUE SYSTEEM : https://www.programmingmind.net/phaser/turn-based-battle */
    var AttackTurnQueue = /** @class */ (function () {
        function AttackTurnQueue(comparator) {
            this.size = 0;
            this.runningcounter = 0;
            this.comparator = comparator || defaultcomparator;
            this.array = new Array();
        }
        AttackTurnQueue.prototype.Compare = function (a, b) {
            var cmp = this.comparator(a.value, b.value);
            return (cmp < 0) || ((cmp == 0) && (a.counter < b.counter));
        };
        AttackTurnQueue.prototype.Renumber = function (myVal) {
            var buffer = [];
            var j, size;
            while (!this.isEmpty()) {
                buffer.push(this.poll().value);
            }
            size = buffer.length;
            this.runningcounter = 0; // because the buffer is safe, this is now safe
            // and we reinsert it
            for (j = 0; j < size; j++) {
                this.add(buffer[j]);
            }
        };
        AttackTurnQueue.prototype.add = function (myVal) {
            var i = this.size;
            if (this.runningcounter + 1 == 0) {
                this.Renumber();
            }
            var extendedmyval = { value: myVal, counter: this.runningcounter };
            this.array[this.size] = extendedmyval;
            this.runningcounter += 1;
            this.size += 1;
            var p;
            var ap;
            var cmp;
            while (i > 0) {
                p = (i - 1) >> 1;
                ap = this.array[p];
                if (!this.Compare(extendedmyval, ap)) {
                    break;
                }
                this.array[i] = ap;
                i = p;
            }
            this.array[i] = extendedmyval;
        };
        AttackTurnQueue.prototype._percolateUp = function (i) {
            var myval = this.array[i];
            var p;
            var ap;
            while (i > 0) {
                p = (i - 1) >> 1;
                ap = this.array[p];
                if (!this.Compare(myval, ap)) {
                    break;
                }
                this.array[i] = ap;
                i = p;
            }
            this.array[i] = myval;
        };
        AttackTurnQueue.prototype._percolateDown = function (i) {
            var size = this.size;
            var hsize = this.size >>> 1;
            var ai = this.array[i];
            var l;
            var r;
            var bestc;
            while (i < hsize) {
                l = (i << 1) + 1;
                r = l + 1;
                bestc = this.array[l];
                if (r < size) {
                    if (this.Compare(this.array[r], bestc)) {
                        l = r;
                        bestc = this.array[r];
                    }
                }
                if (!this.Compare(bestc, ai)) {
                    break;
                }
                this.array[i] = bestc;
                i = l;
            }
            this.array[i] = ai;
        };
        AttackTurnQueue.prototype.peek = function () {
            if (this.size == 0)
                return undefined;
            return this.array[0].value;
        };
        AttackTurnQueue.prototype.poll = function () {
            if (this.size == 0)
                return undefined;
            var ans = this.array[0];
            if (this.size > 1) {
                this.array[0] = this.array[--this.size];
                this._percolateDown(0 | 0);
            }
            else {
                this.size -= 1;
            }
            return ans.value;
        };
        AttackTurnQueue.prototype.trim = function () {
            this.array = this.array.slice(0, this.size);
        };
        AttackTurnQueue.prototype.isEmpty = function () {
            return this.size === 0;
        };
        AttackTurnQueue.prototype.updateQueue = function () {
            this.trim();
            var buffer = [];
            while (!this.isEmpty()) {
                buffer.push(this.poll());
            }
            for (var j = 0; j < buffer.length; j++) {
                this.add(buffer[j]);
            }
        };
        AttackTurnQueue.prototype.getArray = function () {
            return this.array;
        };
        return AttackTurnQueue;
    }());
    RpgGame.AttackTurnQueue = AttackTurnQueue;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var BattleState = /** @class */ (function (_super) {
        __extends(BattleState, _super);
        function BattleState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BattleState.prototype.preload = function () {
            this.game.load.image('bg', '../sprites/backgrounds/battle_background.png');
            this.BattleMenu = document.getElementById("battlemenu");
            this.AttackBtn = document.getElementById("attackbtn");
            this.ItemBtn = document.getElementById("itembtn");
            this.SkipBtn = document.getElementById("skipbtn");
            this.FleeBtn = document.getElementById("fleebtn");
            this.enemies = new Array();
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 320;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;
        };
        BattleState.prototype.create = function () {
            //speler niet laten bewegen
            RpgGame.speler.setCanPlayerMove(false);
            //scale verhogen
            RpgGame.speler.scale.set(4);
            this.CreateBackground();
            this.CreateEventListeners();
            this.GetEnemies();
            this.ShowPlayer();
            //Battlemenu zichtbaar maken
            this.BattleMenu.classList.remove("hidden");
            var BackToOpenWorldTest = this.input.keyboard.addKey(Phaser.Keyboard.A);
            BackToOpenWorldTest.onDown.add(this.CheckForBackToOpenWorld, this);
            this.canAttack = true;
        };
        BattleState.prototype.shutdown = function () {
            this.game.stage.backgroundColor = '#000';
            this.BattleMenu.classList.add("hidden");
            //speler mag weer bewegen
            RpgGame.speler.setCanPlayerMove(true);
            //scaling weer goedzetten van speler.
            RpgGame.speler.scale.set(1.4);
            this.world.remove(RpgGame.speler);
            this.world.remove(RpgGame.speler.getPortrait());
            for (var i = 0; i < this.enemies.length; i++) {
                //Element van wereld en enemies array verwijderen.
                this.enemies.splice(i, 1);
            }
            //Hele state opschonen
            this.world.removeAll();
        };
        BattleState.prototype.GetEnemies = function () {
            $.ajax({
                url: "../Game/GetRandomMonsters",
                type: "POST",
                data: {},
                success: this.LoadEnemyAssets.bind(this)
            });
        };
        BattleState.prototype.LoadEnemyAssets = function (data) {
            this.game.load.onLoadComplete.addOnce(this.CreateEnemies.bind(this, data), this);
            for (var i = 0; i < data.length; i++) {
                //Asset inladen
                this.game.load.image("enemy" + data[i].id, "../images/exiles/" + data[i].image_url);
            }
            //Laden starten
            this.game.load.start();
            //Callback voor als alle images geladen zijn
        };
        BattleState.prototype.CreateEnemies = function (data) {
            //Variabelen die per loop veranderen
            var nextPriority = RpgGame.speler.GetPriority();
            var startX = this.game.world.centerX - 50;
            var yPosition = this.game.world.centerY;
            for (var i = 0; i < data.length; i++) {
                //Nextpriority met een omhoog zetten
                nextPriority++;
                //Monster creeren
                var monster = new RpgGame.Unit(this.game, nextPriority, 1, startX, yPosition, "enemy" + data[i].id);
                monster.anchor.set(1, 1);
                //Indien het monster niet de goede kant op kijkt, de sprite flippen, tevens scaled dit de sprite omlaag naar 40% van de normale lengte/breedte.
                monster.scale.setTo(-0.6, 0.6);
                startX += 250;
                //Javascript is een goede taal btw haHAA
                var MinimumMultiplier = 5;
                var RandomMultiplier = Math.floor(Math.random() * (RpgGame.speler.getLevel() - MinimumMultiplier + 1)) + MinimumMultiplier;
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
        };
        BattleState.prototype.CreateEventListeners = function () {
            this.AttackBtn.addEventListener('click', this.HandleAttack.bind(this));
            this.ItemBtn.addEventListener('click', this.HandleItem.bind(this));
            this.SkipBtn.addEventListener('click', this.HandleSkip.bind(this));
            this.FleeBtn.addEventListener('click', this.HandleFlee.bind(this));
        };
        BattleState.prototype.CheckForBackToOpenWorld = function () {
            this.game.state.start('GameState');
        };
        BattleState.prototype.ShowPlayer = function () {
            var playerX = this.game.world.centerX - 200;
            RpgGame.speler.x = playerX;
            RpgGame.speler.y = this.game.world.centerY - 150;
            this.game.physics.enable(RpgGame.speler, Phaser.Physics.ARCADE);
            this.game.add.existing(RpgGame.speler);
        };
        BattleState.prototype.CreateBackground = function () {
            this.game.stage.backgroundColor = "#50695A";
            var bg = this.game.add.sprite(0, -100, 'bg');
            //Height verminderen zodat de image niet onder het battle menu komt te vallen.
            bg.height = this.game.height - 66;
            bg.anchor.set(0);
            bg.scale.set(1);
        };
        BattleState.prototype.HandleAttack = function (attacker, target) {
        };
        BattleState.prototype.HandleItem = function () {
        };
        BattleState.prototype.HandleSkip = function () {
        };
        BattleState.prototype.HandleFlee = function () {
        };
        BattleState.prototype.createQueue = function () {
            var _this = this;
            this.queue = new RpgGame.AttackTurnQueue(function (a, b) {
                // we want the lowest number to go first
                return a.Priority - b.Priority;
            });
            //Portraits creeren
            RpgGame.speler.createPortrait(this.game);
            this.enemies.forEach(function (enemy) { return enemy.createPortrait(_this.game); });
            //speler en enemies toevoegen aan queue
            this.queue.add(RpgGame.speler);
            this.enemies.forEach(function (enemy) { return _this.queue.add(enemy); });
            //Queue verversen met nieuwe waardes
            this.queue.updateQueue();
            //alle portraits in een queue zetten, zodat we ze gezamelijk kunnen verschuiven
            this.queueGroup = this.add.group();
            this.queueGroup.add(RpgGame.speler.getPortrait());
            this.enemies.forEach(function (enemy) { return _this.queueGroup.add(enemy.getPortrait()); });
            //Boven in het scherm plaatsen
            this.queueGroup.y = 50;
            var portraitWidth = this.queueGroup.children[0].width + 5;
            var totalWidth = portraitWidth * this.queueGroup.children.length;
            //centreren op het scherm op basis van de width
            this.queueGroup.x = this.world.centerX - totalWidth / 2;
        };
        BattleState.prototype.updateQueue = function () {
            //Prioriteit van monsters en spelers updaten.
            this.enemies.forEach(function (monster) {
                monster.SetPriority(Phaser.Math.max(1, monster.GetPriority() - monster.getSpeed()));
            });
            RpgGame.speler.SetPriority(Phaser.Math.max(1, RpgGame.speler.GetPriority() - RpgGame.speler.getSpeed()));
            //oude attacking unit weer toevoegen
            this.queue.add(this.attackingUnit);
            //queue updaten
            this.queue.updateQueue();
            //visuele queue updaten op scherm
            this.updateVisualQueue();
            //kijken of speler de volgende is
            if (this.queue.peek().name.includes('Player')) {
                //control teruggeven aan speler
                this.canAttack = true;
            }
            else {
                this.canAttack = false;
                //speler aanvallen.
                this.attackingUnit = this.queue.poll();
                this.HandleAttack(this.attackingUnit, RpgGame.speler);
            }
        };
        BattleState.prototype.updateVisualQueue = function () {
            for (var i = 0; i < this.queue.getArray().length; i++) {
                //unit opvragen en portret updaten
                var unit = this.queue.getArray()[i].value;
                var portrait = unit.getPortrait();
                //margin toevoegen om ze uit elkaar te houden
                var posx = i * (portrait.width + 5);
                //animatie toevoegen voor aanpassing
                if (portrait.alpha == 0) {
                    portrait.x = posx;
                    this.game.add.tween(portrait).to({ alpha: 1 }, 500 * RpgGame.ANIM_SPEED, Phaser.Easing.Linear.None, true);
                }
                else {
                    this.game.add.tween(portrait).to({ x: posx }, 300 * RpgGame.ANIM_SPEED, Phaser.Easing.Linear.None, true);
                }
                //Prioriteit nummer weergeven
                portrait.text.setText(' ' + unit.Priority + ' ');
            }
        };
        return BattleState;
    }(Phaser.State));
    RpgGame.BattleState = BattleState;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var Game = /** @class */ (function (_super) {
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
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: 'phaserGame',
        transparent: false,
        antialias: false
    });
};
var RpgGame;
(function (RpgGame) {
    var BaseUiState = /** @class */ (function (_super) {
        __extends(BaseUiState, _super);
        function BaseUiState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseUiState.prototype.preload = function () {
            //ui elementen opvragen
            this.InventoryWrapper = document.getElementById("inventory");
            this.EquipmentWrapper = document.getElementById("equipment");
            this.EscapeMenuWrapper = document.getElementById("escapemenu");
            this.BackToMenuBtn = document.getElementById("backfromgame");
        };
        BaseUiState.prototype.create = function () {
            var inventoryKey = this.input.keyboard.addKey(Phaser.Keyboard.I);
            inventoryKey.onDown.add(this.ToggleInventory, this);
            var equipmentKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
            equipmentKey.onDown.add(this.ToggleEquipment, this);
            var escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            escapeKey.onDown.add(this.ToggleEscapeMenu, this);
            this.BackToMenuBtn.addEventListener('click', this.BackToMenu.bind(this));
        };
        BaseUiState.prototype.ToggleInventory = function () {
            this.InventoryWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.ToggleEquipment = function () {
            this.EquipmentWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.ToggleEscapeMenu = function () {
            this.EscapeMenuWrapper.classList.toggle("hidden");
        };
        BaseUiState.prototype.BackToMenu = function () {
            //Alle menu's verbergen.
            this.InventoryWrapper.classList.add("hidden");
            this.EquipmentWrapper.classList.add("hidden");
            this.EscapeMenuWrapper.classList.add("hidden");
            this.game.state.start('MainMenu');
        };
        return BaseUiState;
    }(Phaser.State));
    RpgGame.BaseUiState = BaseUiState;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
///<reference path='UiBaseState.ts' />
var RpgGame;
(function (RpgGame) {
    var Tiled = Phaser.Plugin.Tiled;
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this._land = this._background = null;
            this._playerHealthText = null;
            this._Time = new Phaser.Time(this.game);
        };
        GameState.prototype.preload = function () {
            //base Ui state
            _super.prototype.preload.call(this);
            //Phaser tiled toevoegen als plugin.
            this.add.plugin(new Tiled(this.game, this.game.stage));
            //Opslaan van benodigde assets in cachekey.
            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            //Tilemap laden
            this.game.load.tiledmap(cacheKey('myTiledMap', 'tiledmap'), '../sprites/Map/test.json', null, Phaser.Tilemap.TILED_JSON);
            //Benodigde Tilesets laden.
            this.game.load.image(cacheKey('myTiledMap', 'tileset', 'town'), '../sprites/tilesets/Town.png');
            //this.game.load.image(cacheKey('myTiledMap', 'tileset', 'Car'), '../sprites/car.png');
            //Resolutie regelen
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.minWidth = 320;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1920;
            this.scale.maxHeight = 1080;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;
            this._Time.advancedTiming = true;
            this._Time.desiredFps = 60;
            this._Time.fpsMax = 60;
            this._Time.fpsMin = 30;
        };
        GameState.prototype.create = function () {
            //Base ui state
            _super.prototype.create.call(this);
            //Tilemap toevoegen
            this._land = this.game.add.tiledmap('myTiledMap');
            this.physics.setBoundsToWorld();
            var TileLayer = this._land.layers[0];
            var RoadLayer = this._land.layers[1];
            TileLayer.scale.set(1);
            TileLayer.resizeWorld();
            RoadLayer.scale.set(1);
            RoadLayer.resizeWorld();
            this.game.physics.enable(RpgGame.speler, Phaser.Physics.ARCADE);
            this.game.add.existing(RpgGame.speler);
            RpgGame.speler.visible = true;
            //Speler
            this.game.camera.follow(RpgGame.speler);
            var BattleTestKey = this.input.keyboard.addKey(Phaser.Keyboard.H);
            BattleTestKey.onDown.add(this.CheckForBattleTest, this);
            //Text
            //this._playerHealthText = this.game.add.text(10, 500, "Health: " + this._Player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
        };
        GameState.prototype.CheckForBattleTest = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.H)) {
                this.StartBattle();
            }
        };
        GameState.prototype.StartBattle = function () {
            this.game.state.start('BattleMenu');
        };
        GameState.prototype.update = function () {
            this.collisionCheck();
        };
        GameState.prototype.collisionCheck = function () {
            //COLLISION
        };
        GameState.prototype.shutdown = function () {
            this._land.destroy();
            this.world.remove(RpgGame.speler);
        };
        return GameState;
    }(RpgGame.BaseUiState));
    RpgGame.GameState = GameState;
})(RpgGame || (RpgGame = {}));
var RpgGame;
(function (RpgGame) {
    //<summary>Deze klassen gaat over de overgang van interactie met de inventory/equipment dom elementen en de phaser game variabelen.<summary>
    var InventorySystem = /** @class */ (function () {
        function InventorySystem() {
            this.ListenForKey = document.onkeydown;
        }
        InventorySystem.prototype.FillInventory = function () {
            this.InventoryWrapper = document.getElementById("inventorywrapper");
            this.inventorySlots = this.InventoryWrapper.getElementsByClassName("gameinventoryitem");
            this.AddEventListeners();
        };
        InventorySystem.prototype.FillEquipment = function () {
            this.EquipmentWrapper = document.getElementById("equipmentwrapper");
            this.equipmentSlots = this.EquipmentWrapper.getElementsByClassName("gameinventoryitem");
            this.AddEquipmentEventListeners();
            this.AddStatsToUI();
        };
        InventorySystem.prototype.AddEventListeners = function () {
            for (var i = 0; i < this.inventorySlots.length; i++) {
                //ONCLICK
                /* this.inventorySlots[i].addEventListener('click', function () {
                    console.log("Inventory Slot aangeklikt");
                }); */
                //RIGHT CLICK , ACTIONS LATEN ZIEN
                this.inventorySlots[i].addEventListener('contextmenu', this.ShowContextMenu.bind(this));
            }
        };
        InventorySystem.prototype.AddEquipmentEventListeners = function () {
            for (var i = 0; i < this.equipmentSlots.length; i++) {
                this.equipmentSlots[i].addEventListener('contextmenu', this.ShowContextMenu.bind(this));
            }
        };
        InventorySystem.prototype.ShowContextMenu = function (e) {
            //Indien nodig oude contextmenu verbergen
            if (this.ContextMenu != undefined) {
                this.ContextMenu.classList.add("hidden");
            }
            //Contextmenu div opvragen
            var parentDiv = e.target.parentElement || e.srcElement.parentElement;
            this.ContextMenu = parentDiv.getElementsByClassName("context-menu")[0];
            console.log("Right Click");
            e.preventDefault();
            //Contextmenu laten zien
            this.ContextMenu.classList.remove("hidden");
            this.ContextMenu.style.display = 'block';
            this.ContextMenu.style.left = e.offsetX + 10 + 'px';
            //Onclick handelen van opties
            for (var i = 0; i < this.ContextMenu.childElementCount; i++) {
                var item = this.ContextMenu.children[i];
                //ul negeren
                if (item.outerHTML === "ul") {
                }
                else {
                    item.addEventListener('click', this.HandleContextClick.bind(this));
                }
            }
            return false;
        };
        InventorySystem.prototype.HandleContextClick = function (e) {
            var item = e.target || e.srcElement;
            console.log("Clicked : " + item.className);
            //Context menu verbergen
            this.HideContextMenu();
        };
        InventorySystem.prototype.HideContextMenu = function () {
            this.ContextMenu.classList.add("hidden");
            //var keycode = 
            this.ContextMenu.style.display = 'none';
        };
        InventorySystem.prototype.ListenForKey = function (e) {
            var keycode = e.which || e.keyCode;
            if (keycode == 27) {
                this.HideContextMenu();
            }
            this.HideContextMenu();
        };
        InventorySystem.prototype.AddStatsToUI = function () {
            var strength = RpgGame.speler.GetStrength();
            var intelligence = RpgGame.speler.GetIntelligence();
            document.getElementById("playerstr").innerHTML = "Str : " + strength.toString();
            document.getElementById("playerint").innerHTML = " Int : " + intelligence.toString();
        };
        InventorySystem.prototype.updateStats = function () {
            var strengthToAdd = this.EquipmentWrapper.getElementsByClassName("strstat");
            var intToAdd = this.EquipmentWrapper.getElementsByClassName("intstat");
            //strength updaten
            for (var i = 0; i < strengthToAdd.length; i++) {
                var value = strengthToAdd[i].textContent.split(" : ")[1];
                console.log("str node value : " + value);
                RpgGame.speler.SetStrength(RpgGame.speler.GetStrength() + Number(value));
            }
            //intelligence updaten
            for (var i = 0; i < intToAdd.length; i++) {
                var value = intToAdd[i].textContent.split(" : ")[1];
                console.log('int node value : ' + value);
                RpgGame.speler.SetIntelligence(RpgGame.speler.GetIntelligence() + Number(value));
            }
            this.AddStatsToUI();
        };
        InventorySystem.prototype.EquipItem = function (item) {
            if (item.equipped === true) {
                if (this.TempInt != undefined && this.TempStrength != undefined && this.TempCategory === item.category) {
                    console.log("Oude Stats Verwijderen");
                    RpgGame.speler.SetStrength(RpgGame.speler.GetStrength() - this.TempStrength);
                    RpgGame.speler.SetIntelligence(RpgGame.speler.GetIntelligence() - this.TempInt);
                }
                //Temp variables updaten
                this.TempInt = item.intelligence;
                this.TempStrength = item.strength;
                this.TempCategory = item.category;
                //item is geequiped in inventory, stats verhogen.
                RpgGame.speler.SetStrength(RpgGame.speler.GetStrength() + item.strength);
                RpgGame.speler.SetIntelligence(RpgGame.speler.GetIntelligence() + item.intelligence);
            }
            else {
                //Tempstats terugzetten.
                this.TempInt = undefined;
                this.TempStrength = undefined;
                this.TempCategory = undefined;
                //item is geunequiped in equipment scherm, stats verlagen.
                RpgGame.speler.SetStrength(RpgGame.speler.GetStrength() - item.strength);
                RpgGame.speler.SetIntelligence(RpgGame.speler.GetIntelligence() - item.intelligence);
            }
            console.log("str : " + RpgGame.speler.GetStrength());
            console.log("int : " + RpgGame.speler.GetIntelligence());
        };
        InventorySystem.prototype.UseItem = function (item) {
            console.log("use item");
            //this.bag.push(item);
            //Inventory onclick updaten.
            //this.FillInventory();
        };
        InventorySystem.prototype.RemoveItem = function (item) {
            //Index zoeken en item verwijderen
            /*  var index = this.bag.indexOf(item);
              if (index > -1) {
                  this.bag.splice(index, 1);
              }
              //Inventory onclick updaten
              this.FillInventory(); */
            console.log("remove item");
        };
        return InventorySystem;
    }());
    RpgGame.InventorySystem = InventorySystem;
})(RpgGame || (RpgGame = {}));
var RpgGame;
(function (RpgGame) {
    //Basis elementen van een item, rest komt vanuit asp zelf.
    var Item = /** @class */ (function () {
        function Item() {
        }
        Item.prototype.SetName = function (name) {
            this.name = name;
        };
        Item.prototype.SetDescription = function (description) {
            this.description = description;
        };
        return Item;
    }());
    RpgGame.Item = Item;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="../lib/jquery/jquery.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var MainMenu = /** @class */ (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.preload = function () {
            //benodigde assets laden
            this.load.image('titlepage', '../sprites/mainmenu/mainmenubackground.png');
            this.load.image('logo', '../sprites/mainmenu/logo.png');
            this.load.audio('music', '../Media/mainmenu/intro.mp3', true);
            //speler alvast laden, spritesheet splitsen op basis van sprite grootte 48x64
            this.game.load.spritesheet('Player', '../sprites/character_walk.png', 48, 64);
            //Scaling goedzetten.
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenTarget = document.getElementById("phaserGame");
            //HTML ELEMENTEN OPVRAGEN
            this.menuDiv = document.getElementById("MainMenu");
            this.musicMuteBtn = document.getElementById("mutebtn");
            this.fullscreenBtn = document.getElementById("fullscreentoggle");
            this.characterMenuDiv = document.getElementById("CharacterMenu");
        };
        MainMenu.prototype.create = function () {
            //Achtergrond en logo toevoegen
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, 0, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            //Muziek toevoegen
            this.music = this.add.audio('music', 1, false);
            this.music.play();
            //Achtergrond langzaam in het scherm brengen.
            var fadeInBackground = this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Default, true);
            //Menu laten zien zodra achtergrond animatie klaar is
            fadeInBackground.onComplete.addOnce(this.ShowMenu, this);
            //Logo animeren
            this.add.tween(this.logo).to({ y: 250 }, 1500, Phaser.Easing.Default, true);
            //Input regelen
            //this.playBtn.addEventListener('click', this.fadeOut.bind(this));
            this.musicMuteBtn.addEventListener('click', this.ToggleMusic.bind(this));
            this.fullscreenBtn.addEventListener('click', this.ToggleFullScreen.bind(this));
            //Speler initaliseren
            /*  speler = new Player(this.game, this.world.centerX, 350)
              speler.visible = false; */
            this.addInputListeners();
            //ONCLICK VAN EEN VAN DE CHARACTERS DEZE FUNCTIE UITVOEREN ZODAT UI ELEMENTEN GEKOPPELD WORDEN AAN ONCLICK
            //speler.GetInventory().FillInventory();
        };
        MainMenu.prototype.addInputListeners = function () {
            document.body.addEventListener('click', this.SetPlayerVariables.bind(this));
        };
        MainMenu.prototype.SetPlayerVariables = function (e) {
            var target = e.target.className || e.srcElement.className;
            if (target == "gamecharacter") {
                //Speler initialiseren
                RpgGame.speler = new RpgGame.Player(this.game, this.game.world.centerX, 350, "Player");
                window.player = RpgGame.speler;
                var naam = e.target.children[0] || e.srcElement.children[0];
                var level = e.target.children[1] || e.srcElement.children[1];
                //Speler naam en level goedzetten
                RpgGame.speler.SetName(naam.textContent);
                RpgGame.speler.SetLevel(level.textContent);
                this.fadeOut();
            }
        };
        MainMenu.prototype.HideMenu = function () {
            this.menuDiv.classList.add("hidden");
        };
        MainMenu.prototype.ShowMenu = function () {
            //Indien we terug van de game komen, alle originele knoppen zichtbaar maken.
            this.menuDiv.children[0].classList.remove("hidden");
            this.menuDiv.children[1].classList.remove("hidden");
            this.menuDiv.children[2].classList.remove("hidden");
            this.menuDiv.classList.remove("hidden");
        };
        MainMenu.prototype.ToggleFullScreen = function () {
            if (this.scale.isFullScreen) {
                this.scale.stopFullScreen();
            }
            else {
                this.scale.startFullScreen(false);
            }
        };
        MainMenu.prototype.ToggleMusic = function () {
            if (this.music.isPlaying) {
                this.music.pause();
            }
            else {
                this.music.resume();
            }
        };
        MainMenu.prototype.fadeOut = function () {
            var tween = this.game.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
            //tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            //Charactermenu verbergen
            this.characterMenuDiv.classList.add("hidden");
            //Muziek stopzetten.
            this.music.stop();
            //Spel opstarten
            this.game.state.start('GameState');
        };
        return MainMenu;
    }(Phaser.State));
    RpgGame.MainMenu = MainMenu;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var Unit = /** @class */ (function (_super) {
        __extends(Unit, _super);
        function Unit(game, priority, speed, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, 0) || this;
            _this.name = key;
            _this.strength = 10;
            _this.intelligence = 10;
            _this.Priority = priority;
            _this.Speed = speed;
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(1);
            return _this;
        }
        Unit.prototype.FillInventory = function (Items) {
            this.HeldItems.push(Items);
        };
        Unit.prototype.GetPriority = function () {
            return this.Priority;
        };
        Unit.prototype.SetPriority = function (priority) {
            this.Priority = priority;
        };
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
            this.scale.x *= 1.75;
            this.scale.y *= 1.75;
            this.x = this.game.world.centerX;
            //Speel attack animatie
        };
        Unit.prototype.hurt = function (blood) {
            var _this = this;
            // almost double up their size
            // note that we are not setting them, but instead multiplying them to the existing value
            this.scale.x *= 1.75;
            this.scale.y *= 1.75;
            // start on the center of the game, offset (and some) by the width of the attacker
            this.x = this.game.world.centerX - this.width - 100;
            // wait for a bit for the attacker's ATTACK animation to play out a bit
            this.game.time.events.add(300 * RpgGame.ANIM_SPEED, function () {
                // and just about time the attack animation lands it's blow
                // we play the target's HURT animation
                // using the spriter's position
                // we can more or less center the blood effect at the unit's body
                var x = _this.x;
                var y = _this.y;
                blood.position.set(x, y);
                // show the blood effect once
                blood.visible = true;
                blood.play('blood', 15 / RpgGame.ANIM_SPEED, false);
            });
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
        return Unit;
    }(Phaser.Sprite));
    RpgGame.Unit = Unit;
})(RpgGame || (RpgGame = {}));
/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="Unit.ts"/>
var RpgGame;
(function (RpgGame) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, key, frame) {
            var _this = 
            //Speler mag altijd als eerste slaan in een battle.
            _super.call(this, game, 1, 1, x, y, key, 0) || this;
            _this.playerHealth = 40.0;
            //Waardes goedzetten.
            //this.currentState = playerStates.ALIVE;
            //this.isHitting = false;
            _this.canMove = true;
            _this.inventory = new RpgGame.InventorySystem();
            //base values
            /*  this.strength = 10;
             this.intelligence = 10; */
            //Sprite control
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(1.4);
            //animaties toevoegen vanuit spritesheet. wordt geplitst in preload van mainmenu
            _this.animations.add('up', [0, 1, 2]);
            _this.animations.add('right', [3, 4, 5]);
            _this.animations.add('down', [6, 7, 8]);
            _this.animations.add('left', [9, 10, 11]);
            _this.animations.add('idle', [7]);
            return _this;
        }
        Player.prototype.getPlayerHealth = function () { return this.playerHealth; };
        Player.prototype.setPlayerHealth = function (health) { this.playerHealth = health; };
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
                    this.body.velocity.x = 150;
                    this.animations.play('right', 10, true);
                    //this.animations.play('walk');
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.body.velocity.y = -150;
                    this.animations.play('up', 10, true);
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    this.body.velocity.y = 150;
                    this.animations.play('down', 10, true);
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
//# sourceMappingURL=RpgGame.js.map