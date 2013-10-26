"use strict";

var chai = require("chai"),
    sinon = require("sinon"),
    react = require("../" + require("../package.json").main),
    expect = chai.expect;

chai.Assertion.includeStack = true;
chai.use(require("sinon-chai"));

function createSignal() {

    function signal() {
        return signal.value;
    }
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

    return signal;
}

describe("react()", function () {
    var signal,
        otherSignal,
        doSomething;

    beforeEach(function () {
        signal = createSignal();
        doSomething = sinon.spy();
    });

    describe(".when(signal)", function () {

        describe(".changes", function () {

            describe(".then(func)", function () {

                it("should call func every time the signal changes", function () {
                    react().when(signal).changes.then(doSomething);

                    signal.trigger();
                    signal.value = undefined;
                    signal.trigger();
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".exists", function () {

            it("should call func every time the signal's value is neither undefined nor null", function () {
                react().when(signal).exists.then(doSomething);

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
                    react().when(signal).equals("1").then(doSomething);

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

        describe(".equals(signal)", function () {

            beforeEach(function () {
                otherSignal = createSignal();
            });

            describe(".then(func)", function () {

                it("should call func every time the signal's value strictly equals the other signal's value", function () {
                    react().when(signal).equals(otherSignal).then(doSomething);

                    signal.value = "1";
                    signal.trigger();
                    otherSignal.value = 1;
                    signal.trigger();
                    signal.value = 1;
                    signal.trigger();
                    signal.value = "1";
                    signal.trigger();
                    otherSignal.value = "1";
                    otherSignal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".contains(value)", function () {

            describe(".then(func)", function () {

                it("should call func every time the signal's string contains the given string", function () {
                    react().when(signal).contains("Hello").then(doSomething);

                    signal.trigger();
                    signal.value = "Hallo";
                    signal.trigger();
                    signal.value = "Hello";
                    signal.trigger();
                    signal.trigger();
                    signal.value = "Hallo";
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

                it("should call func every time the signal's array contains the given number", function () {
                    react().when(signal).contains(4).then(doSomething);

                    signal.trigger();
                    signal.value = [1, 2, 3];
                    signal.trigger();
                    signal.value.push(4);
                    signal.trigger();
                    signal.value.push(5);
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

                it("should call func every time the signal's array contains the given signal", function () {
                    otherSignal = createSignal();

                    react().when(signal).contains(otherSignal).then(doSomething);

                    signal.trigger();
                    signal.value = [1, 2, 3];
                    signal.trigger();
                    signal.value.push(4);
                    otherSignal.value = 4;
                    otherSignal.trigger();
                    signal.value.push(5);
                    signal.trigger();

                    expect(doSomething).to.have.been.calledTwice;
                });

            });

        });

        describe(".does", function () {

            describe(".not", function () {

                describe(".exist", function () {

                    it("should call func every time the signal's value is either undefined or null", function () {
                        react().when(signal).does.not.exist.then(doSomething);

                        signal.trigger();
                        signal.value = true;
                        signal.trigger();
                        signal.trigger();
                        signal.value = undefined;
                        signal.trigger();

                        expect(doSomething).to.have.been.calledTwice;
                    });

                });

                describe(".equal(value)", function () {

                    describe(".then(func)", function () {

                        it("should call func every time the signal's value strictly does not equal the given value", function () {
                            var doSomething = sinon.spy();

                            react().when(signal).does.not.equal("1").then(doSomething);

                            signal.value = 1;
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

                describe(".equal(signal)", function () {

                    beforeEach(function () {
                        otherSignal = createSignal();
                    });

                    describe(".then(func)", function () {

                        it("should call func every time the signal's value strictly does not equal the other signal's value", function () {
                            react().when(signal).does.not.equal(otherSignal).then(doSomething);

                            signal.value = "1";
                            signal.trigger();
                            otherSignal.value = 1;
                            signal.trigger();
                            signal.value = 1;
                            signal.trigger();
                            signal.value = "1";
                            signal.trigger();
                            otherSignal.value = "1";
                            otherSignal.trigger();

                            expect(doSomething).to.have.been.calledThrice;
                        });

                    });

                });

            });

        });

    });

    describe(".once(signal)", function () {

        describe(".equals(value)", function () {

            describe(".then(func)", function () {

                it("should call func whenever the signal's value changed from another value to the given value again", function () {
                    react().once(signal).equals("1").then(doSomething);

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

    });

    describe("... .then(func)", function () {

        it("should return the composition", function () {
            var comp = react().when(signal).changes.then(doSomething);

            expect(comp).to.be.an.instanceof(react.Composition);
        });

        describe(".now()", function () {

            it("should trigger an initial evaluation", function () {
                react().when(signal).does.not.exist.then(doSomething).now();

                expect(doSomething).to.have.been.calledOnce;
            });

            it("should also return the composition", function () {
                var comp = react().when(signal).changes.then(doSomething).now();

                expect(comp).to.be.an.instanceof(react.Composition);
            });

        });

    });

});