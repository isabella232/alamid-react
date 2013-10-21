"use strict";

var current = require("./current.js");

function Condition(target) {
    current.condition = this;

    this.target = target;
    this.composition = current.composition;
    this.once = Condition.prototype.once;
    this.evaluate = this.evaluate.bind(this);
}

Condition.prototype.api = {
    get when() {
        Condition.prototype.once = false;

        return current.composition.targets;
    },
    get once() {
        Condition.prototype.once = true;

        return current.composition.targets;
    }
};

Condition.prototype.target = null;
Condition.prototype.not = false;
Condition.prototype.result = false;
Condition.prototype.once = true;
Condition.prototype.composition = null;
Condition.prototype.dispose = null;
Condition.prototype.evaluate = function () {
    var previousResult = this.result;

    this.result = this.not? !this.query() : this.query();

    if (this.result === true) {
        if (this.once === false || previousResult === false) {
            this.composition.evaluate();
        }
    }
};

module.exports = Condition;