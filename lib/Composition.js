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
        return Condition.prototype.api;
    },
    then: function (listener) {
        current.composition.listener = listener;
        current.composition.conditions.forEach(callEvaluate);
        current.composition.evaluate();
    }
};

Composition.prototype.conditions = null;

Composition.prototype.listener = null;

Composition.prototype.dispose = function () {
    this.conditions.forEach(callDispose);
};

Composition.prototype.evaluate = function () {
    var conditions = this.conditions,
        i;

    for (i = 0; i < conditions.length; i++) {
        if (conditions[i].result === false) {
            return;
        }
    }

    this.listener();
};

Composition.prototype.addCondition = function (condition) {
    this.conditions.push(condition);
};

function callDispose(condition) {
    condition.dispose();
}

function callEvaluate(condition) {
    condition.evaluate();
}

module.exports = Composition;