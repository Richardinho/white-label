/* */ 
(function(process) {
  'use strict';
  var ReactDOMNullInputValuePropDevtool = require('./ReactDOMNullInputValuePropDevtool');
  var ReactDOMUnknownPropertyDevtool = require('./ReactDOMUnknownPropertyDevtool');
  var ReactDebugTool = require('./ReactDebugTool');
  var warning = require('fbjs/lib/warning');
  var eventHandlers = [];
  var handlerDoesThrowForEvent = {};
  function emitEvent(handlerFunctionName, arg1, arg2, arg3, arg4, arg5) {
    eventHandlers.forEach(function(handler) {
      try {
        if (handler[handlerFunctionName]) {
          handler[handlerFunctionName](arg1, arg2, arg3, arg4, arg5);
        }
      } catch (e) {
        process.env.NODE_ENV !== 'production' ? warning(handlerDoesThrowForEvent[handlerFunctionName], 'exception thrown by devtool while handling %s: %s', handlerFunctionName, e + '\n' + e.stack) : void 0;
        handlerDoesThrowForEvent[handlerFunctionName] = true;
      }
    });
  }
  var ReactDOMDebugTool = {
    addDevtool: function(devtool) {
      ReactDebugTool.addDevtool(devtool);
      eventHandlers.push(devtool);
    },
    removeDevtool: function(devtool) {
      ReactDebugTool.removeDevtool(devtool);
      for (var i = 0; i < eventHandlers.length; i++) {
        if (eventHandlers[i] === devtool) {
          eventHandlers.splice(i, 1);
          i--;
        }
      }
    },
    onCreateMarkupForProperty: function(name, value) {
      emitEvent('onCreateMarkupForProperty', name, value);
    },
    onSetValueForProperty: function(node, name, value) {
      emitEvent('onSetValueForProperty', node, name, value);
    },
    onDeleteValueForProperty: function(node, name) {
      emitEvent('onDeleteValueForProperty', node, name);
    },
    onTestEvent: function() {
      emitEvent('onTestEvent');
    }
  };
  ReactDOMDebugTool.addDevtool(ReactDOMUnknownPropertyDevtool);
  ReactDOMDebugTool.addDevtool(ReactDOMNullInputValuePropDevtool);
  module.exports = ReactDOMDebugTool;
})(require('process'));
