/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>

module RpgGame{

    var defaultcomparator = function (a, b) {
        return a.Priority - b.Priority
    };

    /*  SOURCE VOOR QUEUE SYSTEEM : https://www.programmingmind.net/phaser/turn-based-battle */
    export class AttackTurnQueue {
        private array: any;
        private size: number;
        private runningcounter: number;
        private comparator: any;


        constructor() {
            this.size = 0;
            this.runningcounter = 0;
            this.comparator =  defaultcomparator;
            this.array = new Array();
        }

        Compare(a, b) {
            var cmp = this.comparator(a.value, b.value);
            return (cmp < 0) || ((cmp == 0) && (a.counter < b.counter));
        }

        Renumber(myVal?) {
            var buffer = [];
            var j, size;
            while (!this.isEmpty()) {
                buffer.push(this.poll().value);
            }
            size = buffer.length;
            this.runningcounter = 0; // because the buffer is safe, this is now safe
            // and we reinsert it
            for (j = 0; j < size; j++) {
                this.add(buffer[j]);
            }
        }

        add(myVal) {
            var i = this.size;
            if (this.runningcounter + 1 == 0) {
                this.Renumber();
            }
            var extendedmyval = { value: myVal, counter: this.runningcounter };
            this.array[this.size] = extendedmyval;
            this.runningcounter += 1;
            this.size += 1;
            var p;
            var ap;
            var cmp;
            while (i > 0) {
                p = (i - 1) >> 1;
                ap = this.array[p];
                if (!this.Compare(extendedmyval, ap)) {
                    break;
                }
                this.array[i] = ap;
                i = p;
            }
            this.array[i] = extendedmyval;
        }

        _percolateUp(i) {
            var myval = this.array[i];
            var p;
            var ap;
            while (i > 0) {
                p = (i - 1) >> 1;
                ap = this.array[p];
                if (!this.Compare(myval, ap)) {
                    break;
                }
                this.array[i] = ap;
                i = p;
            }
            this.array[i] = myval;
        }

        _percolateDown(i) {
            var size = this.size;
            var hsize = this.size >>> 1;
            var ai = this.array[i];
            var l;
            var r;
            var bestc;
            while (i < hsize) {
                l = (i << 1) + 1;
                r = l + 1;
                bestc = this.array[l];
                if (r < size) {
                    if (this.Compare(this.array[r], bestc)) {
                        l = r;
                        bestc = this.array[r];
                    }
                }
                if (!this.Compare(bestc, ai)) {
                    break;
                }
                this.array[i] = bestc;
                i = l;
            }
            this.array[i] = ai;
        }

        peek() {
            if (this.size == 0) return undefined;
            return this.array[0].value;
        }

        poll() {
            if (this.size == 0)
                return undefined;
            var ans = this.array[0];
            if (this.size > 1) {
                this.array[0] = this.array[--this.size];
                this._percolateDown(0 | 0);
            } else {
                this.size -= 1;
            }
            return ans.value;
        }

        trim() {
            this.array = this.array.slice(0, this.size);
        }

        isEmpty() {
            return this.size === 0;
        }

        updateQueue() {
            this.trim();

            var buffer = [];
            while (!this.isEmpty()) {
                buffer.push(this.poll());
            }

            for (var j = 0; j < buffer.length; j++) {
                this.add(buffer[j]);
            }
        }

        getArray() {
            return this.array;
        }

        getSize() {
            return this.size;
        }

        remove(target) {
            var index = this.array.findIndex(t => t.value.name == target.name);
            this.array.splice(index, 1);
            this.size -= 1;
        }
    }

}