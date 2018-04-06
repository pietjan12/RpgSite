module RpgGame {

    export class InventorySystem {
        private InventoryWrapper: HTMLElement;
        //Nodelist van alle inventory slots
        private inventorySlots: NodeListOf<Element>;
        private ContextMenu: HTMLElement;
        //Array van items
        private bag: Item[] = [];

        constructor() {
            this.ListenForKey = document.onkeydown;
        }

        public FillInventory() {
            this.InventoryWrapper = document.getElementById("inventorywrapper");
            this.inventorySlots = document.getElementsByClassName("gameinventoryitem");
            this.AddEventListeners();
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

        public GetInventory(): Item[] {
            return this.bag;
        }

        public EquipItem(item) {
            console.log("equip item");
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