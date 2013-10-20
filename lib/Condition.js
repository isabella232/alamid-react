"use strict";

function Condition(composition) {
    this.composition = composition;
    this.evaluate = this.evaluate.bind(this);
}

Condition.prototype.composition = null;
Condition.prototype.target = null;
Condition.prototype.everytime = false;
Condition.prototype.once = false;
Condition.prototype.not = false;
Condition.prototype.result = false;
Condition.prototype.comparisonValue = null;
Condition.prototype.evaluate = function () {
    var previousResult = this.result;

    this.result = this.not? !this.query() : this.query();

    if (this.result === true) {
        if (this.everytime || (this.once && previousResult === false)) {
            this.composition.evaluate();
        }
    }
};
Condition.prototype.dispose = function () {
    this.target && this.target.unnotify(this.evaluate);
};

module.exports = Condition;