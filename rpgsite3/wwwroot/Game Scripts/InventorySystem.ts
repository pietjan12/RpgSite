module RpgGame {

    //<summary>Deze klassen gaat over de overgang van interactie met de inventory/equipment dom elementen en de phaser game variabelen.<summary>
    export class InventorySystem {
        private EquipmentWrapper: HTMLElement;
        private InventoryWrapper: HTMLElement;
        //Nodelist van alle equipment slots
        private equipmentSlots: NodeListOf<Element>;
        //Nodelist van alle inventory slots
        private inventorySlots: NodeListOf<Element>;
        private ContextMenu: HTMLElement;
        private TempInt: number;
        private TempStrength: number;
        private TempCategory: string;

        constructor() {
            this.ListenForKey = document.onkeydown;
        }

        public FillInventory() {
            this.InventoryWrapper = document.getElementById("inventorywrapper");
            this.inventorySlots = this.InventoryWrapper.getElementsByClassName("gameinventoryitem");
            this.AddEventListeners();
        }

        public FillEquipment() {
            this.EquipmentWrapper = document.getElementById("equipmentwrapper");
            this.equipmentSlots = this.EquipmentWrapper.getElementsByClassName("gameinventoryitem");
            this.AddEquipmentEventListeners();

            this.AddStatsToUI();
        }

        private AddEventListeners() {
            for (var i = 0; i < this.inventorySlots.length; i++) {
                //ONCLICK
                /* this.inventorySlots[i].addEventListener('click', function () {
                    console.log("Inventory Slot aangeklikt");
                }); */

                //RIGHT CLICK , ACTIONS LATEN ZIEN
                this.inventorySlots[i].addEventListener('contextmenu', this.ShowContextMenu.bind(this));
            }
        }

        private AddEquipmentEventListeners() {
            for (var i = 0; i < this.equipmentSlots.length; i++) {
                this.equipmentSlots[i].addEventListener('contextmenu', this.ShowContextMenu.bind(this));
            }
        }

        private ShowContextMenu(e) {
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

                } else {
                    item.addEventListener('click', this.HandleContextClick.bind(this));
                }
            }

            return false;
        }

        private HandleContextClick(e) {
            var item = e.target || e.srcElement;
                        
            console.log("Clicked : " + item.className);
            //Context menu verbergen
            this.HideContextMenu();
        }

        private HideContextMenu() {
            this.ContextMenu.classList.add("hidden");
            //var keycode = 
            this.ContextMenu.style.display = 'none';
        }

        private ListenForKey(e) {
            var keycode = e.which || e.keyCode;
            if (keycode == 27) {
                this.HideContextMenu();
            }
            this.HideContextMenu();
        }

        private AddStatsToUI() {
            var strength = speler.GetStrength();
            var intelligence = speler.GetIntelligence();
            document.getElementById("playerstr").innerHTML = "Str : " + strength.toString();
            document.getElementById("playerint").innerHTML = " Int : " + intelligence.toString();
        }

        public updateStats() {
            //FIXEN DOET HET NU DUBBEL
            var strengthToAdd = this.EquipmentWrapper.getElementsByClassName("strstat");
            var intToAdd = this.EquipmentWrapper.getElementsByClassName("intstat");

            //strength updaten
            for (var i = 0; i < strengthToAdd.length; i++) {
                var value = strengthToAdd[i].textContent.split(" : ")[1];
                console.log("str node value : " + value);

                speler.SetStrength(speler.GetStrength() + Number(value));
            }
            //intelligence updaten
            for (var i = 0; i < intToAdd.length; i++) {
                var value = intToAdd[i].textContent.split(" : ")[1];
                console.log('int node value : ' + value);

                speler.SetIntelligence(speler.GetIntelligence() + Number(value));
            }

            this.AddStatsToUI();
        }

        public EquipItem(item) {

            if (item.equipped === true) {
                if (this.TempInt != undefined && this.TempStrength != undefined && this.TempCategory === item.category) {
                    console.log("Oude Stats Verwijderen");
                    speler.SetStrength(speler.GetStrength() - this.TempStrength);
                    speler.SetIntelligence(speler.GetIntelligence() - this.TempInt);
                }
                //Temp variables updaten
                this.TempInt = item.intelligence;
                this.TempStrength = item.strength;
                this.TempCategory = item.category;

                //item is geequiped in inventory, stats verhogen.
                speler.SetStrength(speler.GetStrength() + item.strength);
                speler.SetIntelligence(speler.GetIntelligence() + item.intelligence);
            } else {
                //Tempstats terugzetten.
                this.TempInt = undefined;
                this.TempStrength = undefined;
                this.TempCategory = undefined;
                //item is geunequiped in equipment scherm, stats verlagen.
                speler.SetStrength(speler.GetStrength() - item.strength);
                speler.SetIntelligence(speler.GetIntelligence() - item.intelligence);
            }

            
            console.log("str : " + speler.GetStrength());
            console.log("int : " + speler.GetIntelligence());
            
        }

        public UseItem(item) {
            console.log("use item");
            //this.bag.push(item);
            //Inventory onclick updaten.
            //this.FillInventory();
        }

        public RemoveItem(item) {
            //Index zoeken en item verwijderen

          /*  var index = this.bag.indexOf(item);
            if (index > -1) {
                this.bag.splice(index, 1);
            }
            //Inventory onclick updaten
            this.FillInventory(); */

            console.log("remove item");

        }
    }

}