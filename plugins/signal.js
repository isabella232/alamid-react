"use strict";

var Condition = require("../lib/Condition.js"),
    Composition = require("../lib/Composition.js"),
    current = require("../lib/current.js");

var evaluations = {},
    api;

function SignalCondition(signal) {
    Condition.call(this, signal);

    return this.api;
}

SignalCondition.prototype = Object.create(Condition.prototype);

SignalCondition.prototype.api = api = {
    get does() {
        return this;
    },
    get not() {
        current.condition.not = true;

        return this;
    },
    get changes() {
        var condition = current.condition,
            target = condition.target;

        condition.query = evaluations.changes;

        target.notify(condition.evaluate);

        return Composition.prototype.api;
    },
    equals: function (value) {
        var condition = current.condition,
            target = condition.target;

        condition.comparisonValue = value;
        condition.query = evaluations.equals;

        target.notify(condition.evaluate);

        return Composition.prototype.api;
    }
};
api.equal = api.equals;
Object.defineProperty(api, "exists", {
    get: exists
});
Object.defineProperty(api, "exist", {
    get: exists
});

SignalCondition.prototype.comparisonValue = null;

evaluations.changes = function () {
    if (this.once) {
        this.target.unnotify(this.evaluate);
    }

    return true;
};

evaluations.exists = function () {
    var value = this.target();

    return value !== undefined && value !== null;
};

evaluations.equals = function () {
    var value = this.target();

    return value === this.comparisonValue;
};

function exists() {
    var condition = current.condition;

    condition.query = evaluations.exists;
    condition.target.notify(condition.evaluate);

    return Composition.prototype.api;
}

function createCondition(signal) {
    return new SignalCondition(signal);
}

function signal(react) {
    react.Composition.prototype.targets.signal = createCondition;
}

module.exports = signal;