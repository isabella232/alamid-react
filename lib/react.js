"use strict";

var Composition = require("./Composition.js"),
    Condition = require("./Condition.js");

function React() {
    this.compositions = [];
}

React.prototype = {
    compositions: null,
    when: function (target) {
        var composition = new Composition();

        this.compositions.push(composition);

        return composition.api.when(target);
    },
    once: function (target) {
        var composition = new Composition();

        this.compositions.push(composition);

        return composition.api.once(target);
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