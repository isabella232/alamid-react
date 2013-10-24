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
        current.composition.add(condition);

        return condition.api;
    },
    once: function (target) {
        var condition = new Condition(target);

        condition.once = true;
        current.composition.add(condition);

        return condition.api;
    },
    get and() {
        return Condition.prototype.api;
    },
    then: function (listener) {
        current.composition.listener = listener;
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

Composition.prototype.add = function (condition) {
    this.conditions.push(condition);

    // TODO add possibility of configuration
    if (typeof condition.target.notify === "function") {
        condition.target.notify(condition.evaluate);
    }
};

function callDispose(condition) {
    condition.dispose && condition.dispose();

    // TODO add possibility of configuration
    if (typeof condition.target.unnotify === "function") {
        condition.target.unnotify(condition.evaluate);
    }
}

module.exports = Composition;