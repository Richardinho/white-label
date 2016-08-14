/* */ 
(function(process) {
  'use strict';
  var debugTool = null;
  if (process.env.NODE_ENV !== 'production') {
    var ReactDOMDebugTool = require('./ReactDOMDebugTool');
    debugTool = ReactDOMDebugTool;
  }
  module.exports = {debugTool: debugTool};
})(require('process'));
