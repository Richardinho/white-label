/* */ 
(function(process) {
  'use strict';
  var DOMChildrenOperations = require('./DOMChildrenOperations');
  var ReactDOMIDOperations = require('./ReactDOMIDOperations');
  var ReactComponentBrowserEnvironment = {
    processChildrenUpdates: ReactDOMIDOperations.dangerouslyProcessChildrenUpdates,
    replaceNodeWithMarkup: DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup,
    unmountIDFromEnvironment: function(rootNodeID) {}
  };
  module.exports = ReactComponentBrowserEnvironment;
})(require('process'));
