"use strict";

var Composition = require("./Composition.js");

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

function react() {
    return new React();
}

module.exports = react;