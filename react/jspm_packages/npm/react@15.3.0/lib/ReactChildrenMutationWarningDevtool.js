/* */ 
(function(process) {
  'use strict';
  var ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
  var warning = require('fbjs/lib/warning');
  var elements = {};
  function handleElement(debugID, element) {
    if (element == null) {
      return;
    }
    if (element._shadowChildren === undefined) {
      return;
    }
    if (element._shadowChildren === element.props.children) {
      return;
    }
    var isMutated = false;
    if (Array.isArray(element._shadowChildren)) {
      if (element._shadowChildren.length === element.props.children.length) {
        for (var i = 0; i < element._shadowChildren.length; i++) {
          if (element._shadowChildren[i] !== element.props.children[i]) {
            isMutated = true;
          }
        }
      } else {
        isMutated = true;
      }
    }
    process.env.NODE_ENV !== 'production' ? warning(Array.isArray(element._shadowChildren) && !isMutated, 'Component\'s children should not be mutated.%s', ReactComponentTreeDevtool.getStackAddendumByID(debugID)) : void 0;
  }
  var ReactDOMUnknownPropertyDevtool = {
    onBeforeMountComponent: function(debugID, element) {
      elements[debugID] = element;
    },
    onBeforeUpdateComponent: function(debugID, element) {
      elements[debugID] = element;
    },
    onComponentHasMounted: function(debugID) {
      handleElement(debugID, elements[debugID]);
      delete elements[debugID];
    },
    onComponentHasUpdated: function(debugID) {
      handleElement(debugID, elements[debugID]);
      delete elements[debugID];
    }
  };
  module.exports = ReactDOMUnknownPropertyDevtool;
})(require('process'));
