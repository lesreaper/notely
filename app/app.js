'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.notes'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/notes'});
}]).

directive('focusOn', function(){
  return function(scope, elem, attr) {
    scope.$on(attr.focusOn, function(){
      elem[0].focus();
    });
  };
});
