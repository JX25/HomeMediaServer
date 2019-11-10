const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MusicSchema = new Schema({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    description :{
    type: String,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'People'
    },
    album:{
        type: String
    },
    year:{
        type: Number,
        min: 0,
        max: 2100,
    },
    genre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicGenre'
    },
    tags:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    language:{
        type: String
    },
    slug:{
        type: String,
        unique: true,
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
        type: String,
        enum: ['KID','TN','AD']
    }
});

module.exports = mongoose.model("Music", MusicSchema);