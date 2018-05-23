/// <reference path="../lib/Phaser/phaser.d.ts"/>
/// <reference path="../lib/Phaser/phaser-tiled.d.ts"/>
var RpgGame;
(function (RpgGame) {
    var defaultcomparator = function (a, b) {
        return a.Priority - b.Priority;
    };
    /*  SOURCE VOOR QUEUE SYSTEEM : https://www.programmingmind.net/phaser/turn-based-battle */
    var AttackTurnQueue = (function () {
        function AttackTurnQueue() {
            this.size = 0;
            this.runningcounter = 0;
            this.comparator = defaultcomparator;
            this.array = new Array();
        }
        AttackTurnQueue.prototype.Compare = function (a, b) {
            var cmp = this.comparator(a.value, b.value);
            return (cmp < 0) || ((cmp == 0) && (a.counter < b.counter));
        };
        AttackTurnQueue.prototype.Renumber = function (myVal) {
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
        };
        AttackTurnQueue.prototype.add = function (myVal) {
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
        };
        AttackTurnQueue.prototype._percolateUp = function (i) {
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
        };
        AttackTurnQueue.prototype._percolateDown = function (i) {
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
        };
        AttackTurnQueue.prototype.peek = function () {
            if (this.size == 0)
                return undefined;
            return this.array[0].value;
        };
        AttackTurnQueue.prototype.poll = function () {
            if (this.size == 0)
                return undefined;
            var ans = this.array[0];
            if (this.size > 1) {
                this.array[0] = this.array[--this.size];
                this._percolateDown(0 | 0);
            }
            else {
                this.size -= 1;
            }
            return ans.value;
        };
        AttackTurnQueue.prototype.trim = function () {
            this.array = this.array.slice(0, this.size);
        };
        AttackTurnQueue.prototype.isEmpty = function () {
            return this.size === 0;
        };
        AttackTurnQueue.prototype.updateQueue = function () {
            this.trim();
            var buffer = [];
            while (!this.isEmpty()) {
                buffer.push(this.poll());
            }
            for (var j = 0; j < buffer.length; j++) {
                this.add(buffer[j]);
            }
        };
        AttackTurnQueue.prototype.getArray = function () {
            return this.array;
        };
        AttackTurnQueue.prototype.getSize = function () {
            return this.size;
        };
        AttackTurnQueue.prototype.remove = function (target) {
            var index = this.array.findIndex(function (t) { return t.value.name == target.name; });
            this.array.splice(index, 1);
            this.size -= 1;
        };
        return AttackTurnQueue;
    }());
    RpgGame.AttackTurnQueue = AttackTurnQueue;
})(RpgGame || (RpgGame = {}));
//# sourceMappingURL=AttackTurnQueue.js.map