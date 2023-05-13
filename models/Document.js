require('dotenv').config();
const mongoose = require('mongoose');
const ttl = require('../mongoose-ttl');

const documentScheme = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

documentScheme.plugin(ttl, { ttl: process.env.expires });

module.exports = mongoose.model("Document", documentScheme);