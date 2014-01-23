var AppRouter = Backbone.Router.extend({

  routes: {
    "snippets/:handle": "index"
    , "snippets/post/:handle": "post"
  }

  , view: null

  // UI Views
  , usersView: null

  , initialize: function(){
    Backbone.Router.prototype.initialize.apply(this, arguments);

    socket.on('users', function (data) {
      data.forEach(function(item){
        var content = JST.userslist(data);
        $('[js-users]').empty().append(content);
      });
    });

    // Views (UI and Page)
    this.usersView = new UsersView({
      el: $('[js-users]')
    });

    this.indexView = new IndexView({
      el: $('[role="index"]')
    });

    this.postView = new PostView({
      el: $('[role="post"]')
    });

    // Start Routing
    Backbone.history.start({pushState: true});
    // Ready
    var user = Cookies.get('user');
    socket.emit('app:ready', {
      handle: user
    });
  }

  , index: function(handle){
    this.postView.$el.hide();
    this.indexView.show(handle);
    this.usersView.highlight(handle);
  }

  , post: function(handle) {
    this.indexView.hide();
    this.postView.show(handle);
    this.usersView.highlight(handle);
  }

});

var socket = io.connect('http://localhost:3000');
var appRouter = new AppRouter();
