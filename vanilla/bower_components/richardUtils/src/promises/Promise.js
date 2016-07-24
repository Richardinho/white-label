
(function () {
    "use strict";
    /**
     * Creates am A+ compliant Promise
     * @class
     * @alias PromisesPromise
     * @author  Richard Hunter <richard@richardhunter.co.uk>
     */
    function Promise(init) {

        this.state = {
            pending: true,
            fulfilled: false,
            rejected: false,
            value: null,
            reason: null
        };
        var self = this;
        if (init) { //  give the then method the time to run.
            setTimeout(function() {
                init(self.fulfil.bind(self), self.reject.bind(self));
            }, 0);
        }
    }

    Promise.isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };

    Promise.isPromise = function (obj) {
        return obj instanceof this;
    }

    Promise.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    /**
     * @param {object} value - value of promise
     */
    Promise.prototype.fulfil = function (value) {
        var self = this;
        if (self.state.pending) {
            self.state.pending = false;
            self.state.value = value;
            self.state.fulfilled = true;
            self.onFulfilled();
        }
    };
    /**
     * reject the promise
     * @param {string}  reason - reason for rejection
     */
    Promise.prototype.reject = function (reason) {
        var self = this;
        if (self.state.pending) {
            self.state.pending = false;
            self.state.reason = reason;
            self.state.rejected = true;
            self.onRejection();
        }
    };

    Promise.resolve = function (promise, x) {
        if (x === promise) {
            promise.reject(new TypeError("promise and x refer to same object"));
            return;
        }
        //  If x is a promise, adopt its state [3.4]:
        //  If x is pending, promise must remain pending until x is fulfilled or rejected.
        //  If/when x is fulfilled, fulfill promise with the same value.
        //  If/when x is rejected, reject promise with the same reason.
        if (Promise.isPromise(x)) {
            promise.state = x.state;
            return;
        }
        var resolveRejectCalled = false;
        //  If both resolvePromise and rejectPromise are called, or multiple calls to the same argument
        //  are made, the first call takes precedence, and any further calls are ignored.
        function resolvePromise(y) {
            if(!resolveRejectCalled) {
                //  If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                Promise.resolve(promise, y);
                resolveRejectCalled = true;
            }
        }

        function rejectPromise(r) {
            if(!resolveRejectCalled) {
                //  If/when rejectPromise is called with a reason r, reject promise with r.
                promise.reject(r);
                resolveRejectCalled = true;
            }
        }

        if (Promise.isObject(x)) {
            var then = x.then;
            //  If calling then throws an exception e,
            try {
                then.call(x, resolvePromise, rejectPromise);
            } catch(e) {
                //  If resolvePromise or rejectPromise have been called, ignore it.
                if(!resolveRejectCalled) {
                    //  Otherwise, reject promise with e as the reason.
                    promise.reject(e);
                }
            }

        } else {
            promise.fulfil(x);
        }
    }

    /**
     * @public
     * @param {Function} onFulfilled - success callback
     * @param {Function} onRejected - failure callback
     * @returns {Promise} returns a new promise
     */
    Promise.prototype.then = function (onFulfilled, onRejected) {
        console.log('then()');
        //  Both onFulfilled and onRejected are optional arguments:
        //  If onFulfilled is not a function, it must be ignored.
        var onFulfilledIsFunction = Promise.isFunction(onFulfilled);
        //  If onRejected is not a function, it must be ignored.
        var onRejectedIsFunction = Promise.isFunction(onRejected);

        var promise2 = new Promise();

        var x;
        //  If onFulfilled is a function:
        //  it must be called after promise is fulfilled, with promise's value as its first argument.
        //  it must not be called before promise is fulfilled.
        //it must not be called more than once.
        this.onFulfilled = function () {

            if (onFulfilledIsFunction) {
                //onFulfilled must be called as a function (i.e. with no this value)
                //If onFulfilled throws an exception e, promise2 must be rejected with e as the reason.
                try {
                    x = onFulfilled(this.state.value);
                } catch (e) {
                    promise2.reject(e);
                }
                if (x) {
                    Promise.resolve(promise2, x);
                }
            } else {
                //If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
                promise2.fulfil(this.state.value);
            }
        }

        this.onRejection = function () {
            //  If onRejected is a function,
            //  it must be called after promise is rejected, with promise's reason as its first argument.
            //  it must not be called before promise is rejected.
            //  it must not be called more than once.
            if (onRejectedIsFunction) {
                //  onRejected must be called as a function (i.e. with no this value)
                //  If onRejected throws an exception e, promise2 must be rejected with e as the reason.
                try {
                    x = onRejected(this.state.reason);
                } catch (e) {
                    promise2.reject(e);
                }
                if (x) {
                    Promise.resolve(promise2, x);
                }
            } else {
                // If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
                promise2.reject(this.state.reason);
            }
        }

        return promise2;
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        // Expose jQuery as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = Promise;
    } else {
        //  create global variable
        if(typeof window === "object") {
            window.PromisesPromise = Promise;
        }
    }

}());


