const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PhotoSchema = new Schema({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    timestamp : {
        type: Date,
        required: true,
    },
    tags : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    slug : {
        type: String,
        required: true,
        unique: true,
    },
    file_path : {
        type: String,
        required: true,
        unique: true,
    },
    width : {
        type: Number,
        multipleOf: 1.0,
        required: true,
        unique: true,
    },
    height : {
        type: Number,
        multipleOf: 1.0,
        required: true,
        unique: true,
    },
    description : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("Photo", PhotoSchema);