"use strict";

var current = require("./current.js"),
    Condition = require("./Condition.js");

function Composition() {
    current.composition = this;
    this.conditions = [];
}

Composition.prototype.api = {
    when: function (target) {
        var condition = new Condition(target);

        condition.once = false;
        current.composition.addCondition(condition);

        return condition.api;
    },
    once: function (target) {
        var condition = new Condition(target);

        condition.once = true;
        current.composition.addCondition(condition);

        return condition.api;
    },
    get and() {
        return this;
    },
    then: function (listener) {
        var composition = current.composition;

        composition.listener = listener;

        return composition;
    }
};

Composition.prototype.conditions = null;

Composition.prototype.listener = null;

Composition.prototype.dispose = function () {
    this.conditions.forEach(callDispose);
};

Composition.prototype.evaluate = function () {
    var conditions = this.conditions,
        condition,
        i;

    for (i = 0; i < conditions.length; i++) {
        condition = conditions[i];
        if (condition.evaluate()) {
            this.listener();
            return this;
        }
    }

    return this;
};

Composition.prototype.now = Composition.prototype.evaluate;

Composition.prototype.addCondition = function (condition) {
    this.conditions.push(condition);

    return this;
};

function callDispose(condition) {
    condition.dispose();
}

module.exports = Composition;