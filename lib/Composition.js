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
        var composition = current.composition,
            conditions = composition.conditions,
            callListener = true,
            condition,
            i;

        composition.listener = listener;

        for (i = 0; i < conditions.length; i++) {
            condition = conditions[i];
            condition.evaluate();
            if (condition.result === false) {
                callListener = false;
            }
        }

        callListener && listener.call(composition);
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

module.exports = Composition;