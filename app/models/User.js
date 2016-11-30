var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  openId: String,
  createTime: Date,
  AskCount: Number,
});

mongoose.model('User', UserSchema);
