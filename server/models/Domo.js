const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  coolness: {
    type: Number,
    min: 0,
    max: 10,
    requiered: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.static.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  coolness: doc.coolness,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
