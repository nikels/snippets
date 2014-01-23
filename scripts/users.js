var Q = require('q');
var handles = [
  'ncastrop'
  , 'evan'
  , 'tyler'
  , 'steve'
  , 'toni'
  , 'mhebert'
  , 'greg'
  , 'sdamani'
  , 'ryan'
];
var mongoose = require('mongoose');
var UserModel = require('./src/models/user');
var remove = Q.denodeify(UserModel.remove.bind(UserModel));
var create = Q.denodeify(UserModel.create.bind(UserModel));
var users = [];

mongoose.connect('mongodb://localhost/snippets');

while(handles.length){

  var handle = handles.pop();
  var user = new UserModel({
    handle: handle
    , email: [handle, "@sparefoot.com"].join('')
    , loggedin: false
  });

  users.push(user);

}

remove()
.then(function(){
  return create(users);
})
.fail(function(){
  console.log(arguments);
})
.finally(function(){
  mongoose.disconnect();
});
