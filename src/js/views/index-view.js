var IndexView = Backbone.View.extend({

  events: {
    'submit form': 'postComment'
    , 'click button': 'postComment'
    , 'mousedown [js-code]': 'startTracking'
    , 'mouseup [js-code]': 'endTracking'
  }

  , handle: null

  , lineRegex: /number(\d+)/
  , lineNumbers: []

  , comments: []

  , initialize: function(){
    Backbone.View.prototype.initialize.apply(this, arguments);

    this.resize();
    $(window).on('resize', _.bind(this.resize, this));
  }

  , resize: function(){
    var winHeight = $(window).height();

    this.$('[js-code]').css({
      height: Math.floor(winHeight * 0.7)
      , overflow: 'auto'
    });

    this.$('[js-comments]').css({
      height: Math.floor(winHeight * 0.3) - this.$('form').height()
      , overflow: 'auto'
    });
  }

  , startTracking: function(evt){

    this.clear();
    this.lineNumbers.length = 0;

    var $line = $(evt.target).closest('.line');

    $line.addClass('commented');

    // Find line number
    var matches = this.lineRegex.exec($line.attr('class'));
    this.lineNumbers.push(Number(matches[1]));

    this.$('[js-code]').on('mousemove', this.track);
  }

  , endTracking: function(evt){

    var i;
    var $line = $(evt.target).closest('.line');

    // Find line number
    var matches = this.lineRegex.exec($line.attr('class'));
    this.lineNumbers.push(Number(matches[1]));
    this.lineNumbers.sort(function(a, b){
      return a > b;
    });

    this.highlightLines(this.lineNumbers[0], this.lineNumbers[1]);
    this.$('[js-code]').off('mousemove', this.track);
  }

  , track: function(evt){
    var $line = $(evt.target).closest('.line');
    $line.addClass('commented');
  }

  , highlightLines: function(start, finish){

    this.clear();

    for(start; start <= finish; start++){
      this.$('.line.number'+start).addClass('commented');
    }

  }

  , clear: function(){
    //window.getSelection().empty();
    this.$('.line').removeClass('commented');
  }

  , hide: function(){

    socket.removeAllListeners('code');
    socket.removeAllListeners('comments:'+this.handle);

    while(this.comments.length){
      var comment = this.comments.pop();
      comment.remove();
    }

    this.$el.hide();
  }

  , show: function(handle){

    this.handle = handle;

    this.hide();

    socket.on('code', _.bind(this.renderCode, this));
    socket.on('comments:'+this.handle, _.bind(this.renderComments, this));

    socket.emit('code', {
      handle: this.handle
    });

    socket.emit('comments', {
      commentee: this.handle
    });

    this.$el.show();
  }

  , postComment: function(evt){
    evt.preventDefault();

    var user = Cookies.get('user');
    var $input = this.$('input');
    var val = $input.val();

    socket.emit('comment', {
      commentee: this.handle
      , commentor: user
      , comment: val
      , lines: this.lineNumbers
    });

    $input.val('');
  }

  , renderCode: function(data){
    var content = JST.code(data);
    this.$('[js-code]').empty().append(content);
    SyntaxHighlighter.highlight();
  }

  , renderComments: function(data){

    var comment;
    var commentView;
    var content = JST.commentstable(data);
    var $comments = this.$('[js-comments]');

    $comments.empty().append(content);

    if(data.length === 0){
      this.$('[js-comments], [js-form]').hide();
      return;
    }

    this.$('[js-comments], [js-form]').show();

    data.forEach(_.bind(function(item, indx, array){

      item.date = moment(item.date).fromNow();
      comment = JST.commentsrow(item);

      var commentView = new CommentView({
        model: new Backbone.Model(item)
        , el: comment
        , parent: this
      });

      $comments.find('tbody').append(commentView.$el);

      this.comments.push(commentView);

      if(indx+1 === array.length){

        var tableHeight = $comments.find('table').height();

        $comments.animate({
          scrollTop: tableHeight
        }, 10);

        this.highlightLines(item.lines[0], item.lines[1]);
      }
    }, this));
  }

});
