module RpgGame {
    //Basis elementen van een item, rest komt vanuit asp zelf.
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