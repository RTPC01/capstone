const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoriturSchema = new Schema({
    title: String,
    image: String,
    description: String
});

module.exports = mongoose.model('Noritur', NoriturSchema);