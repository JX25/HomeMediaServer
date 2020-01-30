const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AudioSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description :{
    type: String,
    },
    author:{
        type: String,
        required: true
    },
    album:{
        type: String
    },
    year:{
        type: Number,
        min: 0,
        max: 2100,
        required: true
    },
    genre:{
        type: String,
    },
    tags:[{
        type: String,
    }],
    language:{
        type: String,
    },
    slug:{
        type: String,
        unique: true,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    file_path:{
        type: String,
        required: true
    },
    length:{
        type: Number,
        minimum: 0
    },
    age_rate:{
        type: Number,
        enum: [0, 1, 2]
    },
    created: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Audio", AudioSchema);