/* */ 
(function(process) {
  'use strict';
  var _prodInvariant = require('./reactProdInvariant');
  var ReactElement = require('./ReactElement');
  var invariant = require('fbjs/lib/invariant');
  function onlyChild(children) {
    !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'onlyChild must be passed a children with exactly one child.') : _prodInvariant('23') : void 0;
    return children;
  }
  module.exports = onlyChild;
})(require('process'));
