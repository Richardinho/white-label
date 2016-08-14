/* */ 
(function(process) {
  'use strict';
  var _prodInvariant = require('./reactProdInvariant');
  var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
  var ReactPropTypesSecret = require('./ReactPropTypesSecret');
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactComponentTreeDevtool;
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
    ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
  }
  var loggedTypeFailures = {};
  function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        try {
          !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          loggedTypeFailures[error.message] = true;
          var componentStackInfo = '';
          if (process.env.NODE_ENV !== 'production') {
            if (!ReactComponentTreeDevtool) {
              ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
            }
            if (debugID !== null) {
              componentStackInfo = ReactComponentTreeDevtool.getStackAddendumByID(debugID);
            } else if (element !== null) {
              componentStackInfo = ReactComponentTreeDevtool.getCurrentStackAddendum(element);
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
        }
      }
    }
  }
  module.exports = checkReactTypeSpec;
})(require('process'));
