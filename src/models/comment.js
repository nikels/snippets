var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  commentee: String
  , commentor: String
  , comment: String
  , lines: Array
  , date: Date
});

var Model = mongoose.model('Comment', commentSchema);
module.exports = Model;
