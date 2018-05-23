var RpgGame;
(function (RpgGame) {
    //Basis elementen van een item, wordt gebruikt om een item te consumeren.
    var Item = (function () {
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
//# sourceMappingURL=Item.js.map