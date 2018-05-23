/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="../lib/jquery/jquery.d.ts"/>
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
    var MainMenu = (function (_super) {
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
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenTarget = document.getElementById("phaserGame");
            //HTML ELEMENTEN OPVRAGEN
            this.menuDiv = document.getElementById("MainMenu");
            this.musicMuteBtn = document.getElementById("mutebtn");
            this.fullscreenBtn = document.getElementById("fullscreentoggle");
            this.characterMenuDiv = document.getElementById("CharacterMenu");
        };
        MainMenu.prototype.create = function () {
            //Physics systeem vsat inladen
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            //Achtergrond en logo toevoegen
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.game.camera.x + (this.game.width / 2), 0, 'logo');
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
                //Speler initialiseren met 100 health
                RpgGame.speler = new RpgGame.Player(this.game, 100, 0, 0, "Player");
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
//# sourceMappingURL=MainMenu.js.map