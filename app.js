var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var holla = require('holla');
var rtc = holla.createServer(server);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/snippets');

var _ = require('underscore');
var Q = require('q');

var UserModel = require('./src/models/user');
var CommentModel = require('./src/models/comment');

var findUsers = Q.denodeify(UserModel.find.bind(UserModel));
var findOneUser = Q.denodeify(UserModel.findOne.bind(UserModel));

var findComments = Q.denodeify(CommentModel.find.bind(CommentModel));
var createComment = Q.denodeify(CommentModel.create.bind(CommentModel));

app.use(express.static('public'));
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.cookieSession());
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.get('/snippets/login/:handle', function (req, res) {

  var handle = req.params.handle;

  res.cookie('user', handle);

  findUsers()
  .then(function(){
    io.sockets.emit('users', users);
  });

  res.redirect('/snippets/post');
});

app.post('/snippets/code', function (req, res) {

  var handle = req.param('handle');
  var code = req.param('code');

  findOneUser({handle: handle})
  .then(function(user){
    user.set({
      snippet: {
        language: 'js'
        , code: code
      }
    });
    user.save(function(err){
      if(err){
        res.send(400);
      }
      res.send(200, "OK");
    });
  });
});

app.get('/snippets/*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

server.listen(3000);

io.sockets.on('connection', function(socket) {

  socket.on('app:ready', function(data){

    var handle = data.handle;
    socket.set('handle', handle);

    // Someone logged in. Let everyone know.
    findOneUser({handle: handle})
    .then(function(user){
      return user.online(true);
    })
    .then(findUsers)
    .then(function(users){
      socket.emit('users', users);
    });

  });

  socket.on('code', function(data){

    var handle = data.handle;

    findOneUser({handle: handle})
    .then(function(user){
      var snippet = user.snippet;
      socket.emit('code', snippet);
    });
  });

  socket.on('comments', function(data){

    var commentee = data.commentee;

    findComments({commentee: commentee})
    .then(function(comments){
      socket.emit('comments:'+commentee, comments);
    });
  });

  socket.on('comment', function (data) {

    var commentee = data.commentee;
    var commentor = data.commentor;
    var comment = data.comment;
    var lines = data.lines;

    createComment({
      commentee: commentee
      , commentor: commentor
      , comment: comment
      , lines: lines
      , date: new Date()
    })
    .then(function(){
      return findComments({commentee: commentee});
    })
    .then(function(comments){
      io.sockets.emit('comments:'+commentee, comments);
    })
    .catch(function(){
      console.log('arguments', arguments);
    });

  });

  socket.on('disconnect', function () {

    socket.get('handle', function(err, handle){

      findOneUser({handle: handle})
      .then(function(user){
        return user.online(false);
      })
      .then(findUsers)
      .then(function(users){
        io.sockets.emit('users', users);
      });
    });
  });

});

