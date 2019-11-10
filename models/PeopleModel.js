const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PeopleSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("People", PeopleSchema);