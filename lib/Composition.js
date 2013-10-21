"use strict";

var current = require("./current.js"),
    Condition = require("./Condition.js");

function Composition() {
    current.composition = this;
    this.conditions = [];
}

Composition.prototype.api = {
    get and() {
        current.composition.add(current.condition);

        return Condition.prototype.api;
    },
    then: function (listener) {
        current.composition.add(current.condition);
        current.composition.listener = listener;
    }
};

Composition.prototype.targets = {};

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

Composition.prototype.add = function (condition) {
    this.conditions.push(condition);
};

function callDispose(condition) {
    condition.dispose();
}

module.exports = Composition;