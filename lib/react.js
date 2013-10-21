"use strict";

var Composition = require("./Composition.js"),
    Condition = require("./Condition.js"),
    current = require("./current.js");

function React() {
    this.compositions = [];
}

React.prototype = {
    compositions: null,
    get when() {
        var composition = new Composition();

        this.compositions.push(composition);

        return Condition.prototype.api.when;
    },
    get once() {
        var composition = new Composition();

        this.compositions.push(composition);

        return Condition.prototype.api.once;
    }
};

function react() {
    return new React();
}

react.Composition = Composition;
react.Condition = Condition;

/**
 * Calls the given function with react as first argument and the given config (optionally). Plugins can be used
 * to hook into class methods by overriding them.
 *
 * @param {Function} plugin
 * @param {Object=} config
 * @returns {react}
 */
react.use = function (plugin, config) {
    plugin(this, config);

    return this;
};

module.exports = react;