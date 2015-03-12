'use strict';

var notelyBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
var apiKey = '$2a$10$XBGDMf7E9czj7TLKA1Ewie4C7pt413Vpg8ARHoicS4EedouucNDLK';

angular.module('myApp.notes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}])

.controller('NotesController', ['$scope', 'NotesBackend', function($scope, NotesBackend) {

  NotesBackend.fetchNotes();

  // $scope.note = {};

  $scope.notes = function() {
    return NotesBackend.getNotes();
  };

  $scope.hasNotes = function() {
    return $scope.notes().length > 0;
  };

  $scope.commit = function() {
    NotesBackend.postNote($scope.note);
  };

  $scope.loadNote = function(note) {
    $scope.note = note;
  }

  $scope.findNoteById = function(noteId) {
    var notes = $scope.notes();
    for (var i=0; i < notes.length; i++) {
      if (notes[i].id === noteId) {
        return notes[i];
      }
    }
  };
}])

.service('NotesBackend', ['$http', function($http){

  var notes = [];

  this.getNotes = function() {
    return notes;
  };

  this.fetchNotes = function() {
    $http.get(notelyBasePath + 'notes.json?api_key=' + apiKey)
    .success(function(notes_data) {
      notes = notes_data;
    });
  };

  this.postNote = function(noteData) {
    $http.post(notelyBasePath + 'notes', {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData) {
      notes.push(newNoteData);
    });
  }

}]);
