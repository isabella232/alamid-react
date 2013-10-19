"use strict";

var conditions = {};

function React() {
    this._compositions = [];
}

React.prototype._compositions = null;

React.prototype.everytime = function (target) {
    var composition = new Composition();

    this._compositions.push(composition);

    return composition.and.everytime(target);
};

React.prototype.once = function (target) {
    var composition = new Composition();

    this._compositions.push(composition);

    return composition.and.once(target);
};

function Composition() {
    this._conditions = [];
}

Composition.prototype = {
    _conditions: null,
    _current: null,
    _listener: null,
    get changes() {
        var condition = this._current,
            target = condition.target;

        condition.query = conditions.changes;
        condition.dispose = condition._disposeSignal;

        target.notify(condition.evaluate);

        return this;
    },
    get and() {
        this._current = new Condition(this);
        this._conditions.push(this._current);

        return this;
    },
    get is() {
        return this;
    },
    get not() {
        this._current.not = true;

        return this;
    },
    get set() {
        var condition = this._current,
            target = condition.target;

        condition.query = conditions.set;
        condition.dispose = condition._disposeSignal;

        target.notify(condition.evaluate);

        return this;
    },
    get again() {
        this._current.again = true;

        return this;
    },
    everytime: function (target) {
        this._current.target = target;
        this._current.everytime = true;
        this._current.again = true;

        return this;
    },
    once: function (target) {
        this._current.target = target;
        this._current.once = true;

        return this;
    },
    equals: function (value) {
        var condition = this._current,
            target = condition.target;

        condition.comparisonValue = value;

        condition.query = conditions.equals;
        condition.dispose = condition._disposeSignal;

        target.notify(condition.evaluate);

        return this;
    },
    then: function (listener) {
        this._listener = listener;
    },
    dispose: function () {
        this._conditions.forEach(callDispose);
    }
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

function Condition(composition) {
    this.composition = composition;
    this.evaluate = this.evaluate.bind(this);
}

Condition.prototype.composition = null;
Condition.prototype.target = null;
Condition.prototype.everytime = false;
Condition.prototype.once = false;
Condition.prototype.again = false;
Condition.prototype.not = false;
Condition.prototype.result = false;
Condition.prototype.comparisonValue = null;
Condition.prototype.evaluate = null;
Condition.prototype.dispose = null;
Condition.prototype.evaluate = function () {
    this.result = this.not? !this.query() : this.query();

    if (this.result === true) {
        if (this.again === false) {
            this.target.unnotify(this.evaluate);
        }

        this.composition.evaluate();
    }
};
Condition.prototype._disposeSignal = function () {
    this.target.unnotify(this.evaluate);
};

conditions.changes = function () {
    return this.everytime? true : this.result === false;
};

conditions.set = function () {
    var preCondition = this.everytime? true : this.result === false,
        value = this.target();

    return preCondition && value !== undefined && value !== null;
};

conditions.equals = function () {
    var preCondition = this.everytime? true : this.result === false,
        value = this.target();

    return preCondition && value === this.comparisonValue;
};

function callDispose(condition) {
    condition.dispose();
}

function react() {
    return new React();
}

module.exports = react;