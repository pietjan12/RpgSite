module RpgGame {
    //Basis elementen van een item, wordt gebruikt om een item te consumeren.
    export class Item {
        private name: string;
        private description: string;

        public SetName(name) {
            this.name = name;
        }

        public SetDescription(description) {
            this.description = description;
        }
    }

}