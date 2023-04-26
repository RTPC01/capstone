const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoriturSchema = new Schema({
    title: String,
    description: String
});

module.exports = mongoose.model('Noritur', NoriturSchema);