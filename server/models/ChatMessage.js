const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  Contents: {
    type: String,
    required: true,
  },
  DateSent: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
});

ChatMessageSchema.static.toAPI = (doc) => ({
  contents: doc.contents,
});

const ChatMessageModel = mongoose.model('ChatMessage', ChatMessageSchema);
module.exports = ChatMessageModel;
