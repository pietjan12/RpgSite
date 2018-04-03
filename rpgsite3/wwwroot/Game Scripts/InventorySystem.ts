module RpgGame {

    export class InventorySystem {
        //Nodelist van alle inventory slots
        private inventorySlots: NodeListOf<Element>;
        //Array van items
        private bag: Item[] = [];

        public FillInventory() {
            this.inventorySlots = document.getElementsByClassName("inventoryslot");
            this.AddEventListeners();
        }

        private AddEventListeners() {
            for (var i = 0; i < this.inventorySlots.length; i++) {
                this.inventorySlots[i].addEventListener('click', function () {
                    console.log("Inventory Slot aangeklikt");
                });
            }

        }

        public GetInventory(): Item[] {
            return this.bag;
        }

        public AddItem(item): void {
            this.bag.push(item);
        }

        public RemoveItem(item): void {
            //Index zoeken en item verwijderen
            var index = this.bag.indexOf(item);
            if (index > -1) {
                this.bag.splice(index, 1);
            }
        }
    }

}