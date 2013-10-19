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

React.prototype.when = function (target) {
    var composition = new Composition();

    this._compositions.push(composition);

    return composition.and.when(target);
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
    get is() {
        return this;
    },
    get set() {
        var condition = this._current,
            target = condition.target;

        if (condition.everytime) {
            condition.evaluate = condition._evalEverytimeIsSet.bind(condition);
        } else if (condition.when) {
            condition.evaluate = condition._evalWhenIsSet.bind(condition);
        } else if (condition.once) {
            condition.evaluate = condition._evalOnceIsSet.bind(condition);
        }
        condition.dispose = condition._disposeSignal;

        target.notify(condition.evaluate);

        return this;
    },
    everytime: function (target) {
        this._current.target = target;
        this._current.everytime = true;

        return this;
    },
    when: function (target) {
        this._current.target = target;
        this._current.when = true;

        return this;
    },
    once: function (target) {
        this._current.target = target;
        this._current.once = true;

        return this;
    },
    equals: function(value) {
        var condition = this._current,
            target = condition.target;

        condition.value = value;

        if (condition.everytime) {
            condition.evaluate = condition._evalEverytimeEquals.bind(condition);
        } else if (condition.when) {
            condition.evaluate = condition._evalWhenEquals.bind(condition);
        } else if (condition.once) {
            condition.evaluate = condition._evalOnceEquals.bind(condition);
        }
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
}

Condition.prototype.composition = null;
Condition.prototype.target = null;
Condition.prototype.everytime = false;
Condition.prototype.once = false;
Condition.prototype.when = false;
Condition.prototype.result = false;
Condition.prototype.value = null;
Condition.prototype.evaluate = null;
Condition.prototype.dispose = null;
Condition.prototype._evalEverytimeChange = function () {
    this.result = true;
    this.composition.evaluate();
};
Condition.prototype._evalOnceChange = function () {
    this.result = true;
    this.target.unnotify(this.evaluate);
    this.composition.evaluate();
};
Condition.prototype._evalEverytimeIsSet = function () {
    var value = this.target();

    this.result = value !== undefined && value !== null;

    if (this.result) {
        this.composition.evaluate();
    }
};
Condition.prototype._evalWhenIsSet = function () {
    var value = this.target();

    this.result = value !== undefined && value !== null && this.result === false;

    if (this.result) {
        this.composition.evaluate();
    }
};
Condition.prototype._evalOnceIsSet = function () {
    var value = this.target();

    this.result = value !== undefined && value !== null;

    if (this.result) {
        this.target.unnotify(this.evaluate);
        this.composition.evaluate();
    }
};
Condition.prototype._evalEverytimeEquals = function () {
    var value = this.target();

    this.result = value === this.value;

    if (this.result) {
        this.composition.evaluate();
    }
};
Condition.prototype._evalWhenEquals = function () {
    var value = this.target();

    this.result = value === this.value && this.result === false;

    if (this.result) {
        this.composition.evaluate();
    }
};
Condition.prototype._evalOnceEquals = function () {
    var value = this.target();

    this.result = value === this.value;

    if (this.result) {
        this.target.unnotify(this.evaluate);
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