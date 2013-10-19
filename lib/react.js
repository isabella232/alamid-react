"use strict";

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

        if (condition.everytime) {
            condition.evaluate = condition._evalEverytimeChange.bind(condition);
        } else {
            condition.evaluate = condition._evalOnceChange.bind(condition);
        }
        condition.dispose = condition._disposeSignal;

        target.notify(condition.evaluate);

        return this;
    },
    get and() {
        this._current = new Condition(this);
        this._conditions.push(this._current);

        return this;
    },
    everytime: function (target) {
        this._current.target = target;
        this._current.everytime = true;

        return this;
    },
    once: function (target) {
        this._current.target = target;

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
}

Condition.prototype.composition = null;
Condition.prototype.target = null;
Condition.prototype.everytime = false;
Condition.prototype.result = false;
Condition.prototype.evaluate = null;
Condition.prototype.dispose = null;
Condition.prototype._evalEverytimeChange = function () {
    this.result = true;
    this.composition.evaluate();
};
Condition.prototype._evalOnceChange = function () {
    if (this.result === false) {
        this.result = true;
        this.composition.evaluate();
    }
};
Condition.prototype._disposeSignal = function () {
    this.target.unnotify(this.evaluate);
};

function callDispose(condition) {
    condition.dispose();
}

function react() {
    return new React();
}

module.exports = react;