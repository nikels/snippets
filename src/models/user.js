var mongoose = require('mongoose');
var Q = require('q');

var userSchema = new mongoose.Schema({
  handle: String
  , email: String
  , snippet: {
    language: String
    , code: String
  }
  , loggedin: Boolean
});

userSchema.methods.online = function(bool){

  var deferred = Q.defer();

  this.loggedin = bool;
  this.save(function(err){

    if(err){
      deferred.reject();
    }

    deferred.resolve();
  });

  return deferred.promise;
};

var Model = mongoose.model('User', userSchema);
module.exports = Model;
