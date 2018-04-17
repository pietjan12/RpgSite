    /// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
/// <reference path="../lib/jquery/jquery.d.ts"/>

module RpgGame {

    export class MainMenu extends Phaser.State {
        background: Phaser.Sprite;
        music: Phaser.Sound;
        logo: Phaser.Sprite;
        private menuDiv: HTMLElement;
        private characterMenuDiv: HTMLElement;
        private musicMuteBtn: HTMLElement;
        private fullscreenBtn: HTMLElement;

        preload() {
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
        }

        create() {
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
            
        }

        addInputListeners() {
            document.body.addEventListener('click', this.SetPlayerVariables.bind(this));
        }

        SetPlayerVariables(e) {
            var target = e.target.className || e.srcElement.className;
            if (target == "gamecharacter") {
                //Speler initialiseren
                speler = new Player(this.game, this.game.world.centerX, 350,"Player");

                (<any>window).player = speler;

                var naam = e.target.children[0] || e.srcElement.children[0];
                var level = e.target.children[1] || e.srcElement.children[1];

                //Speler naam en level goedzetten
                speler.SetName(naam.textContent);
                speler.SetLevel(level.textContent);
                
                this.fadeOut();
            } 
        }

        HideMenu() {
            this.menuDiv.classList.add("hidden");
        }

        ShowMenu() {
            //Indien we terug van de game komen, alle originele knoppen zichtbaar maken.
            this.menuDiv.children[0].classList.remove("hidden");
            this.menuDiv.children[1].classList.remove("hidden");
            this.menuDiv.children[2].classList.remove("hidden");
            this.menuDiv.classList.remove("hidden");
        }

        ToggleFullScreen() {
            if (this.scale.isFullScreen) {
                this.scale.stopFullScreen();
            }
            else {
                this.scale.startFullScreen(false);
            }
        }

        ToggleMusic() {
            if (this.music.isPlaying) {
                this.music.pause();
            } else {
                this.music.resume();
            }
        }

        fadeOut() {
            var tween = this.game.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(this.startGame, this);
            //tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            //Charactermenu verbergen
            this.characterMenuDiv.classList.add("hidden");
            //Muziek stopzetten.
            this.music.stop();
            //Spel opstarten
            this.game.state.start('GameState');
        }
    }


}