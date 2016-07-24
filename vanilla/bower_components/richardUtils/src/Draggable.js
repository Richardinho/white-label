(function (window, undefined) {

    "use strict";

    function Draggable(model, rootel, name, strategy, afterCreate){

        this.model = model;
        this.rootel = rootel;
        this.d = document.createElement('div');
        this.d.setAttribute("class", name);
        this.rootel.appendChild(this.d);
        this.strategy = strategy;

        var self = this;

        this.render();

        function getX(event) {
            return event.clientX;
        }
        function getY(event) {
            return event.clientY;
        }

        var startX = 0, startY = 0;

        function mousedown(event) {

            startX = getX(event);
            startY = getY(event);

            document.body.addEventListener("mousemove", mousemove, false);
            document.body.addEventListener("mouseup", mouseup, false);
            return false;
        }
        function mouseup () {
            startX = 0, startY = 0;
            document.body.removeEventListener("mousemove", mousemove, false);
            document.body.removeEventListener("mouseup", mouseup, false);
        }
        function mousemove(event) {
            var x = getX(event);
            var y = getY(event);
            var diffX = x - startX;
            var diffY = y - startY;
            startX = x;
            startY = y;
            // callback for custom behaviour though will normally simply call updateModel.
            // could also do things like apply constraints to the movement of the draggable e.g. not outside the parent div.
            // todo: should also supply a default if no strategy provided.
            self.strategy(self.model, diffX, diffY);
        }

        this.d.addEventListener("mousedown", mousedown.bind(this), false);

        afterCreate(this);

    }
    Draggable.prototype = {

        updateModel : function(diffX, diffY) {
            this.model.x += diffX;
            this.model.y += diffY;
            this.render();

        },

        render : function () {

            this.d.style.left = this.model.x + "px";
            this.d.style.top = this.model.y + "px";

        }
    };

    window.Draggable = Draggable;

})(window);