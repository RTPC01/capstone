const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentScema = new Schema({
    body: String
})

module.export = mongoose.model("Comment", commentScema);