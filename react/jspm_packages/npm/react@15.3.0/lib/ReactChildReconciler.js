/* */ 
(function(process) {
  'use strict';
  var ReactReconciler = require('./ReactReconciler');
  var instantiateReactComponent = require('./instantiateReactComponent');
  var KeyEscapeUtils = require('./KeyEscapeUtils');
  var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
  var traverseAllChildren = require('./traverseAllChildren');
  var warning = require('fbjs/lib/warning');
  var ReactComponentTreeDevtool;
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
    ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
  }
  function instantiateChild(childInstances, child, name, selfDebugID) {
    var keyUnique = childInstances[name] === undefined;
    if (process.env.NODE_ENV !== 'production') {
      if (!ReactComponentTreeDevtool) {
        ReactComponentTreeDevtool = require('./ReactComponentTreeDevtool');
      }
      process.env.NODE_ENV !== 'production' ? warning(keyUnique, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.%s', KeyEscapeUtils.unescape(name), ReactComponentTreeDevtool.getStackAddendumByID(selfDebugID)) : void 0;
    }
    if (child != null && keyUnique) {
      childInstances[name] = instantiateReactComponent(child, true);
    }
  }
  var ReactChildReconciler = {
    instantiateChildren: function(nestedChildNodes, transaction, context, selfDebugID) {
      if (nestedChildNodes == null) {
        return null;
      }
      var childInstances = {};
      if (process.env.NODE_ENV !== 'production') {
        traverseAllChildren(nestedChildNodes, function(childInsts, child, name) {
          return instantiateChild(childInsts, child, name, selfDebugID);
        }, childInstances);
      } else {
        traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
      }
      return childInstances;
    },
    updateChildren: function(prevChildren, nextChildren, mountImages, removedNodes, transaction, hostParent, hostContainerInfo, context) {
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      var prevChild;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        prevChild = prevChildren && prevChildren[name];
        var prevElement = prevChild && prevChild._currentElement;
        var nextElement = nextChildren[name];
        if (prevChild != null && shouldUpdateReactComponent(prevElement, nextElement)) {
          ReactReconciler.receiveComponent(prevChild, nextElement, transaction, context);
          nextChildren[name] = prevChild;
        } else {
          if (prevChild) {
            removedNodes[name] = ReactReconciler.getHostNode(prevChild);
            ReactReconciler.unmountComponent(prevChild, false);
          }
          var nextChildInstance = instantiateReactComponent(nextElement, true);
          nextChildren[name] = nextChildInstance;
          var nextChildMountImage = ReactReconciler.mountComponent(nextChildInstance, transaction, hostParent, hostContainerInfo, context);
          mountImages.push(nextChildMountImage);
        }
      }
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
          prevChild = prevChildren[name];
          removedNodes[name] = ReactReconciler.getHostNode(prevChild);
          ReactReconciler.unmountComponent(prevChild, false);
        }
      }
    },
    unmountChildren: function(renderedChildren, safely) {
      for (var name in renderedChildren) {
        if (renderedChildren.hasOwnProperty(name)) {
          var renderedChild = renderedChildren[name];
          ReactReconciler.unmountComponent(renderedChild, safely);
        }
      }
    }
  };
  module.exports = ReactChildReconciler;
})(require('process'));
