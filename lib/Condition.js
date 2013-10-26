"use strict";

var current = require("./current.js");

var evaluations = {},
    api;

function Condition(target) {
    current.condition = this;

    this.dependencies = {};
    this.target = target;
    this.composition = current.composition;
    this.once = Condition.prototype.once;
    this.onChange = this.onChange.bind(this);

    this.addDependency("target", target);
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

        condition.addDependency("comparison value", condition.readDependency("target"));
        condition.query = evaluations.changes;
        if (condition.not) {
            throw new Error("Invalid 'not'-flag");
        }

        return current.composition.api;
    },
    equals: function (value) {
        var condition = current.condition;

        condition.addDependency("comparison value", value);
        condition.query = evaluations.equals;

        return current.composition.api;
    },
    contains: function (value) {
        var condition = current.condition;

        condition.addDependency("comparison value", value);
        condition.query = evaluations.contains;

        return current.composition.api;
    }
};

// Add aliases
api.equal = api.equals;
api.contain = api.contains;
Object.defineProperty(api, "exists", {
    get: exists
});
Object.defineProperty(api, "exist", {
    get: exists
});

Condition.prototype.dependencies = null;
Condition.prototype.target = null;
Condition.prototype.not = false;
Condition.prototype.result = false;
Condition.prototype.once = true;
Condition.prototype.composition = null;

Condition.prototype.evaluate = function () {
    var previousResult = this.result;

    this.result = this.not? !this.query() : this.query();

    if (this.result === true) {
        if (this.once === false || previousResult === false) {
            return true;
        }
    }

    return false;
};
Condition.prototype.onChange = function () {
    this.composition.evaluate();
};
Condition.prototype.addDependency = function (name, dependency) {
    // TODO add possibility of configuration
    if (dependency instanceof Object && typeof dependency.notify === "function") {
        dependency.notify(this.onChange);
    }

    this.dependencies[name] = dependency;
};
Condition.prototype.readDependency = function (name) {
    var dependency = this.dependencies[name];

    // TODO add possibility of configuration
    if (typeof dependency === "function") {
        return dependency();
    } else {
        return dependency;
    }
};
Condition.prototype.dispose = function () {
    var key;

    for (key in this.dependencies) {
        if (this.dependencies.hasOwnProperty(key)) {
            // TODO add possibility of configuration
            this.dependencies[key].unnotify(this.onChange);
        }
    }
};

function exists() {
    var condition = current.condition;

    condition.query = evaluations.exists;

    return current.composition.api;
}

evaluations.exists = function () {
    var value = this.readDependency("target");

    return value !== undefined && value !== null;
};

evaluations.equals = function () {
    var value = this.readDependency("target"),
        comparisonValue = this.readDependency("comparison value");

    return value === comparisonValue;
};

evaluations.changes = function () {
    return !evaluations.equals.call(this);
};

evaluations.contains = function () {
    var value = this.readDependency("target"),
        comparisonValue = this.readDependency("comparison value");

    if (value && typeof value.indexOf === "function") {
        return value.indexOf(comparisonValue) !== -1;
    } else {
        return false;
    }
};

module.exports = Condition;