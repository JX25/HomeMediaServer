const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ImageSchema = new Schema({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    timestamp : {
        type: Number,
        min: 10000000000000,
        max: 99999999999999,
    },
    collections: [{
        type: String,
    }],
    tags : [{
        type: String //mongoose.Schema.Types.ObjectId,
        //ref: 'Tag'
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
    thumbnail : {
        type: String,
        required: true,
        unique: true,
    },
    width : {
        type: Number,
        multipleOf: 1.0,
        min: 1,
        required: true,
        unique: true,
    },
    height : {
        type: Number,
        multipleOf: 1.0,
        min: 1,
        required: true,
        unique: true,
    },
    description : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("Image", ImageSchema);