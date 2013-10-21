"use strict";

var chai = require("chai"),
    sinon = require("sinon"),
    react = require("../" + require("../package.json").main),
    expect = chai.expect;

chai.use(require("sinon-chai"));

describe("react() with signal-plugin", function () {
    var signal,
        doSomething;

    beforeEach(function () {
        signal = function () {
            return signal.value;
        };
        signal.value = null;
        signal.listener = null;
        signal.notify = function (listener) {
            this.listener = listener;
        };
        signal.unnotify = function (listener) {
            if (this.listener === listener) {
                delete this.listener;
            }
        };
        signal.trigger = function () {
            this.listener && this.listener();
        };

        doSomething = sinon.spy();
    });

    before(function () {
        react.use(require("../plugins/signal.js"));
    });

    describe(".when(signal)", function () {

        describe(".changes", function () {

            describe(".then(func)", function () {

                it("should call func every time the signal changes", function () {
                    react().when.signal(signal).changes.then(doSomething);

                    signal.trigger();
                    signal.trigger();
                    signal.trigger();

                    expect(doSomething).to.have.been.calledThrice;
                });

            });

        });

        describe(".exists", function () {

            it("should call func every time the signal's value is neither undefined nor null", function () {
                react().when.signal(signal).exists.then(doSomething);

                signal.trigger();
                signal.trigger();
                signal.value = true;
                signal.trigger();
                signal.trigger();
                signal.value = undefined;
                signal.trigger();

                expect(doSomething).to.have.been.calledTwice;
            });

        });

        describe(".equals(value)", function () {

            describe(".then(func)", function () {

                it("should call func every time the signal's value strictly equals the given value", function () {
                    react().when.signal(signal).equals("1").then(doSomething);

                    signal.value = "1";
                    signal.trigger();
                    signal.trigger();
                    signal.value = 1;
                    signal.trigger();
                    signal.trigger();
                    signal.value = "1";
                    signal.trigger();

                    expect(doSomething).to.have.been.calledThrice;
                });

            });

        });

        describe(".does", function () {

            describe(".not", function () {

                describe(".exist", function () {

                    it("should call func every time the signal's value is either undefined or null", function () {
                        react().when.signal(signal).does.not.exist.then(doSomething);

                        signal.trigger();
                        signal.trigger();
                        signal.value = true;
                        signal.trigger();
                        signal.trigger();
                        signal.value = undefined;
                        signal.trigger();

                        expect(doSomething).to.have.been.calledThrice;
                    });

                });

                describe(".equal(value)", function () {

                    describe(".then(func)", function () {

                        it("should call func every time the signal's value strictly does not equal the given value", function () {
                            var doSomething = sinon.spy();

                            react().when.signal(signal).does.not.equal("1").then(doSomething);

                            signal.value = 1;
                            signal.trigger();
                            signal.trigger();
                            signal.value = "1";
                            signal.trigger();
                            signal.trigger();
                            signal.value = 1;
                            signal.trigger();

                            expect(doSomething).to.have.been.calledThrice;
                        });

                    });

                });

            });

        });

    });

    describe(".once(signal)", function () {

        describe(".changes", function () {

            describe(".then(func)", function () {

                it("should call func only the first time the signal notified about a change", function () {
                    react().once.signal(signal).changes.then(doSomething);

                    signal.trigger();
                    signal.trigger();
                    signal.trigger();

                    expect(doSomething).to.have.been.calledOnce;
                });

            });

        });

        describe(".exists", function () {

            describe(".then(func)", function () {

                it("should call func whenever the signal's value changes from null/undefined to something other", function () {
                    react().once.signal(signal).exists.then(doSomething);

                    signal.trigger();
                    signal.trigger();
                    signal.value = true;
                    signal.trigger();
                    signal.trigger();
                    signal.value = undefined;
                    signal.trigger();
                    signal.value = true;
                    signal.trigger();
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".equals(value)", function () {

            describe(".then(func)", function () {

                it("should call func whenever the signal's value strictly equals the given value again", function () {
                    react().once.signal(signal).equals("1").then(doSomething);

                    signal.value = "1";
                    signal.trigger();
                    signal.trigger();
                    signal.value = 1;
                    signal.trigger();
                    signal.trigger();
                    signal.value = "1";
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".does", function () {

            describe(".not", function () {

                describe(".exist", function () {

                    it("should call func whenever the signal's value turned to either undefined or null", function () {
                        react().once.signal(signal).does.not.exist.then(doSomething);

                        signal.value = true;
                        signal.trigger();
                        signal.trigger();
                        signal.value = undefined;
                        signal.trigger();
                        signal.trigger();

                        expect(doSomething).to.have.been.calledOnce;
                    });

                });

                describe(".equal(value)", function () {

                    describe(".then(func)", function () {

                        it("should call func one time whenever the signal's value strictly does not equal the given value", function () {
                            react().once.signal(signal).does.not.equal("1").then(doSomething);

                            signal.value = 1;
                            signal.trigger();
                            signal.trigger();
                            signal.value = "1";
                            signal.trigger();
                            signal.trigger();
                            signal.value = 1;
                            signal.trigger();

                            expect(doSomething).to.have.been.calledTwice;
                        });

                    });

                });

            });

        });

    });

});