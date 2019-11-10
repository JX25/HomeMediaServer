const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TagSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("Tag", TagSchema);