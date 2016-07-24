define(function () {

    // constructor function
    var Node = function (obj, name, parent, nodeType) {

        this.listeners = {};

        this.name = name;
        this.nodeType = nodeType;

        if (parent) {
            this.parent = parent;
        }
        if (typeof obj === 'object') {

            this.children = {};
            for (var prop in obj) {

                this.children[prop] = new Node(obj[prop], prop, this);
            }
        } else {
            this.value = obj;
        }
    };

    Node.prototype.reset = function (obj) {

        if(typeof obj === 'object') {

            this.children = {};

            for (var prop in obj) {
                this.children[prop] = new Node(obj[prop], prop, this);
            }
        }
        this.fire("reset");
    };


    //  return original object
    Node.prototype.unwrap = function () {

        var unwrapped = {};

        for(var child in this.children) {

            if(this.children[child].value) {
                unwrapped[child] = this.children[child].value;
            } else {
                unwrapped[child] = this.children[child].unwrap();
            }
        }

        return unwrapped;
    };

    //  register handler functions
    Node.prototype.on = function (event, handler, context) {

        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push([handler, context]);
    };

    Node.prototype.off = function (event, handler) {

        var arr = this.listeners[event];

        var length = arr.length;

        while(length--) {

            if(handler === arr[length][0]) {

                arr.splice(length,1);

            }
        }
    };

    //  this should return a reference to the child.
    Node.prototype.createChild = function (name, node, nodeType) {
        this.children[name] = new Node(node, name, this, nodeType);
        this.fire("create", this.children[name], nodeType);
        return this.children[name];

    };

    Node.prototype.deleteChild = function (name) {

        var node = this.children[name];

        node.broadcast("delete", node );

        delete this.children[name];

    };

    // broadcast event to all child nodes.
    Node.prototype.broadcast = function (event) {
        // call all listeners on this node
        var listeners;

        if(this.listeners) {
            listeners = this.listeners[event];
        }
        if(listeners) {
            var args =  Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < listeners.length; i++) {
                // call handler using context as 'this'
                listeners[i][0].apply(listeners[i][1], args);
            }
        }
        // fire broadcast on children
        for(var child in this.children) {

            this.children[child].broadcast.apply(this.children[child], arguments);
        }
    };

    // fire method. calls fire method of parent node
    Node.prototype.fire = function (event) {

        var mainEventListeners;
        var subEventListeners,
        args, i;

        var eventArray = event.split(":");

        var mainEvent = eventArray[0];

        if(this.listeners) {
            mainEventListeners = this.listeners[mainEvent];
            subEventListeners = this.listeners[event];
        }

        if (mainEventListeners) {
            args =  Array.prototype.slice.call(arguments, 1);
            for (i = 0; i < mainEventListeners.length; i++) {
                // call handler using context as 'this'
                mainEventListeners[i][0].apply(mainEventListeners[i][1], args);
            }
        }

        if(eventArray.length > 1) {

            if (subEventListeners) {
                args =  Array.prototype.slice.call(arguments, 1);
                for (i = 0; i < subEventListeners.length; i++) {
                    // call handler using context as 'this'
                    subEventListeners[i][0].apply(subEventListeners[i][1], args);
                }
            }
        }

        if (this.parent) {
            this.parent.fire.apply(this.parent, arguments);
        }
    };

    //  set value of node. fire event
    Node.prototype.set = function (newValue, silent) {

        var oldValue = "";

        if (this.value !== undefined) {
            oldValue = this.value;
            this.value = newValue;
            if(!silent) {

                this.fire( "change" + ":" + this.name, newValue, oldValue );
            }
        } else {
            throw {
                name: "NonPrimitiveNodeException",
                message : newValue + " " + oldValue
            };
        }
    };

    return Node;



});
