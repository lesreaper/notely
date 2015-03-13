'use strict';

var notelyBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
var apiKey = '$2a$10$XBGDMf7E9czj7TLKA1Ewie4C7pt413Vpg8ARHoicS4EedouucNDLK';

angular.module('myApp.notes', ['ngRoute', 'textAngular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}])

.controller('NotesController', ['$scope', 'NotesBackend', function($scope, NotesBackend) {

  NotesBackend.fetchNotes();

  $scope.notes = function() {
    return NotesBackend.getNotes();
  };

  $scope.hasNotes = function() {
    return $scope.notes().length > 0;
  };

  $scope.buttonText = function(note) {
    return (note && note.id) ? 'Update Note' : 'Create Note';
  };

  $scope.saveNote = function() {
    if ($scope.note.id) {
      NotesBackend.updateNote($scope.note);
    }
    else {
      NotesBackend.postNote($scope.note, function(newNote) {
        $scope.note = JSON.parse(JSON.stringify(newNote));
      });
    }
  };

  $scope.loadNote = function(note) {
    $scope.note = JSON.parse(JSON.stringify(note));
  };

  $scope.findNoteById = function(noteId) {
    var notes = $scope.notes();
    for (var i=0; i < notes.length; i++) {
      if (notes[i].id === noteId) {
        return notes[i];
      }
    }
  };

  $scope.clearNote = function() {
    $scope.note = {};
    // These do the same thing, but the broadcast listener in the
    // focusOn directive provides a cleaner separation of code from HTML
    // document.getElementById('note_title').focus();
    $scope.$broadcast('noteCleared');
  };

  $scope.deleteNote = function(note) {
    NotesBackend.deleteNote(note, function() {
      $scope.clearNote();
    });
  };

}])

.service('NotesBackend', ['$http', function($http){

  var notes = [];
  var self = this;

  this.getNotes = function() {
    return notes;
  };

  this.fetchNotes = function() {
    $http.get(notelyBasePath + 'notes.json?api_key=' + apiKey)
    .success(function(notes_data) {
      notes = notes_data;
    });
  };

  this.postNote = function(noteData, callback) {
    $http.post(notelyBasePath + 'notes', {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData) {
      notes.push(newNoteData);
      callback(newNoteData);
    });
  };

  this.updateNote = function(note) {
    $http.put(notelyBasePath + 'notes/' + note.id, {
      api_key: apiKey,
      note: note
    }).success(function(response){
      // TODO: replace note in notes variable instead of full refresh
      self.fetchNotes();
    });
  };

  this.deleteNote = function(note, callback) {
    $http.delete(notelyBasePath + 'notes/' + note.id + '?api_key=' + apiKey).success(function(response) {
      self.fetchNotes();
      callback();
    });
  };

}]);
