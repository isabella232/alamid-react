"use strict";

var Condition = require("./Condition.js");

var conditions = {},
    modifiers = {};

function Composition() {
    this._conditions = [];
}

Composition.prototype = {
    _conditions: null,
    _current: null,
    _listener: null,
    get changes() {
        return modifiers.changes.call(this);
    },
    get and() {
        return modifiers.and.call(this);
    },
    get does() {
        return this;
    },
    get not() {
        return modifiers.not.call(this);
    },
    get exists() {
        return modifiers.exists.call(this);
    },
    get exist() {
        return modifiers.exists.call(this);
    },
    everytime: function (target) {
        this._current.target = target;

        return modifiers.everytime.call(this);
    },
    once: function (target) {
        this._current.target = target;

        return modifiers.once.call(this);
    },
    equals: function (value) {
        return modifiers.equals.call(this, value);
    }
};

Composition.prototype.equal = Composition.prototype.equals;

Composition.prototype.then = function (listener) {
    this._listener = listener;
};

Composition.prototype.dispose = function () {
    this._conditions.forEach(callDispose);
};

Composition.prototype.evaluate = function () {
    var conditions = this._conditions,
        i;

    for (i = 0; i < conditions.length; i++) {
        if (conditions[i].result === false) {
            return;
        }
    }

    this._listener();
};

conditions.changes = function () {
    if (this.once) {
        this.target.unnotify(this.evaluate);
    }

    return true;
};

conditions.exists = function () {
    var value = this.target();

    return value !== undefined && value !== null;
};

conditions.equals = function () {
    var value = this.target();

    return value === this.comparisonValue;
};

modifiers.changes = function () {
    var condition = this._current,
        target = condition.target;

    condition.query = conditions.changes;

    target.notify(condition.evaluate);

    return this;
};

modifiers.and = function () {
    this._current = new Condition(this);
    this._conditions.push(this._current);

    return this;
};
modifiers.not = function () {
    this._current.not = true;

    return this;
};
modifiers.exists = function () {
    var condition = this._current,
        target = condition.target;

    condition.query = conditions.exists;

    target.notify(condition.evaluate);

    return this;
};
modifiers.everytime = function () {
    this._current.everytime = true;

    return this;
};
modifiers.once = function () {
    this._current.once = true;

    return this;
};
modifiers.equals = function (value) {
    var condition = this._current,
        target = condition.target;

    condition.comparisonValue = value;
    condition.query = conditions.equals;

    target.notify(condition.evaluate);

    return this;
};

function callDispose(condition) {
    condition.dispose();
}

module.exports = Composition;