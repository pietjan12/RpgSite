module RpgGame {
    export class BaseUiState extends Phaser.State {
        private InventoryWrapper: HTMLElement;
        //TODO OPTIONS MENU TOEVOEGEN HIER
        private EquipmentWrapper: HTMLElement;
        private EscapeMenuWrapper: HTMLElement;
        private BackToMenuBtn: HTMLElement;

        preload() {
            //ui elementen opvragen
            this.InventoryWrapper = document.getElementById("inventory");
            this.EquipmentWrapper = document.getElementById("equipment");
            this.EscapeMenuWrapper = document.getElementById("escapemenu");
            this.BackToMenuBtn = document.getElementById("backfromgame");
        }

        create() {
            var inventoryKey = this.input.keyboard.addKey(Phaser.Keyboard.I);
            inventoryKey.onDown.add(this.ToggleInventory, this);

            var equipmentKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
            equipmentKey.onDown.add(this.ToggleEquipment, this);

            var escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            escapeKey.onDown.add(this.ToggleEscapeMenu, this);

            this.BackToMenuBtn.addEventListener('click', this.BackToMenu.bind(this));
        }

        ToggleInventory() {
            this.InventoryWrapper.classList.toggle("hidden");
        }

        ToggleEquipment() {

            this.EquipmentWrapper.classList.toggle("hidden");
        }

        ToggleEscapeMenu() {
            this.EscapeMenuWrapper.classList.toggle("hidden");
        }

        BackToMenu() {
            //Alle menu's verbergen.
            this.InventoryWrapper.classList.add("hidden");
            this.EquipmentWrapper.classList.add("hidden");
            this.EscapeMenuWrapper.classList.add("hidden");
            this.game.state.start('MainMenu');
        }
    }

}