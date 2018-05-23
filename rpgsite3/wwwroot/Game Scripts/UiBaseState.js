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
    var BaseUiState = (function (_super) {
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
//# sourceMappingURL=UiBaseState.js.map