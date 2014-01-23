var CommentView = Backbone.View.extend({

  events: {
    'click td': 'click'
  }

  , initialize: function(options){
    Backbone.View.prototype.initialize.apply(this, arguments);

    this.parent = options.parent;
  }

  , click: function(evt){
    evt.preventDefault();
    this.highlightCode();
  }

  , highlightCode: function(){
    var lines = this.model.get('lines');
    this.parent.highlightLines(lines[0], lines[1]);
  }
});
