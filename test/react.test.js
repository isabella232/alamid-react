"use strict";

var chai = require("chai"),
    sinon = require("sinon"),
    react = require("../" + require("../package.json").main),
    expect = chai.expect;

describe("react()", function () {
    var signal;

    before(function () {
        signal = {
            listener: null,
            notify: function (listener) {
                this.listener = listener;
            }
        };
    });

    describe(".everytime(signal)", function () {

        describe(".changes", function () {

            describe(".then(func)", function () {

                it("should call func everytime the signal notified about a change", function () {
                    var doSomething = sinon.spy();

                    react().everytime(signal).changes.then(doSomething);

                    expect(signal.listener).to.be.a("function");
                    signal.listener();
                    signal.listener();
                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".is", function () {

            describe(".set", function () {

                it("should call func everytime the signal's value is neither undefined nor null", function () {
                    var doSomething = sinon.spy();

                    react().everytime(signal).is.set.then(doSomething);

                    expect(signal.listener).to.be.a("function");
                    signal.listener();
                    signal.listener();
                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

    });

    describe(".once(signal)", function () {

        describe(".changes", function () {

            describe(".then(func)", function () {

                it("should call func only the first time the signal notified about a change", function () {
                    var doSomething = sinon.spy();

                    react().everytime(signal).changes.then(doSomething);

                    expect(signal.listener).to.be.a("function");
                    signal.listener();
                    signal.listener();
                    expect(doSomething).to.have.been.calledOnce;
                });

            });

        });

    });

});