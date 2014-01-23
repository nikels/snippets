var UsersView = Backbone.View.extend({
  events: {
    'click': 'changeUser'
  }
  , changeUser: function(evt){
    evt.preventDefault();
    appRouter.navigate($(evt.target).attr('href'), {trigger: true});
  }
});
