var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AskHistorySchema = new Schema({
  userId: Schema.ObjectId,
  createTime: Date,
  question: String,
  answer: String,
});

mongoose.model('AskHistory', AskHistorySchema);
