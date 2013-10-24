"use strict";

var current = require("./current.js");

var evaluations = {},
    api;

function Condition(target) {
    current.condition = this;

    this.target = target;
    this.composition = current.composition;
    this.once = Condition.prototype.once;
    this.evaluate = this.evaluate.bind(this);
}

Condition.prototype.api = api = {
    get does() {
        return this;
    },
    get not() {
        current.condition.not = true;

        return this;
    },
    get changes() {
        var condition = current.condition;

        condition.query = evaluations.changes;

        return current.composition.api;
    },
    equals: function (value) {
        var condition = current.condition;

        condition.comparisonValue = value;
        condition.query = evaluations.equals;

        return current.composition.api;
    }
};

// Add aliases
api.equal = api.equals;
Object.defineProperty(api, "exists", {
    get: exists
});
Object.defineProperty(api, "exist", {
    get: exists
});

Condition.prototype.comparisonValue = null;
Condition.prototype.timesEvaluated = 0;
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

    this.timesEvaluated++;
};

// TODO add possibility of configuration
Condition.prototype.readTarget = function () {
    var target = this.target;

    if (typeof target === "function") {
        return target();
    } else {
        return target;
    }
};

function exists() {
    var condition = current.condition;

    condition.query = evaluations.exists;

    return current.composition.api;
}

evaluations.changes = function () {
    //return this.timesEvaluated > 1; // we don't count the initial evaluation
    return true;
};

evaluations.exists = function () {
    var value = this.readTarget();

    return value !== undefined && value !== null;
};

evaluations.equals = function () {
    var value = this.readTarget();

    return value === this.comparisonValue;
};

module.exports = Condition;