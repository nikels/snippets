var PostView = Backbone.View.extend({

  events: {
    'submit form': 'postCode'
  }

  , handle: null

  , show: function(handle){
    this.handle = handle;
    this.$el.show();
  }

  , postCode: function(evt){
    evt.preventDefault();

    var code = this.$('textarea').val();
    var handle = Cookies.get('user');

    if(!code){
      return;
    }

    $.post('/snippets/code', {
      handle: handle
      , code: code
    })
    .success(function(){
      appRouter.navigate('/snippets/'+handle, {trigger: true});
    })
    .error(function(){
      console.log('error', arguments);
    });
  }

});
