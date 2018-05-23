var RpgGame;
(function (RpgGame) {
    //<summary>Deze klassen gaat over de overgang van interactie met de inventory/equipment dom elementen en de phaser game variabelen.<summary>
    var InventorySystem = (function () {
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
            if (item !== undefined) {
                switch (item.name) {
                    case "Apple":
                        console.log("Old Health : " + RpgGame.speler.GetHealth());
                        RpgGame.speler.SetHealth(RpgGame.speler.GetHealth() + item.healing);
                        console.log("New Health : " + RpgGame.speler.GetHealth());
                        break;
                    case "Healing Potion":
                        console.log("Old Health : " + RpgGame.speler);
                        RpgGame.speler.SetHealth(RpgGame.speler.GetHealth() + item.healing);
                        console.log("New Health : " + RpgGame.speler.GetHealth());
                        break;
                    default:
                        console.log("Undefined used item");
                        break;
                }
            }
            console.log("use item");
            //this.bag.push(item);
            //Inventory onclick updaten.
            //this.FillInventory();
        };
        InventorySystem.prototype.RemoveItem = function (item) {
            //In de huidige versie hoeft er niks speciaals te gebeuren als een item 'gedropt' wordt. het item verwijderd simpelweg.
        };
        return InventorySystem;
    }());
    RpgGame.InventorySystem = InventorySystem;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=InventorySystem.js.map