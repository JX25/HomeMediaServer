const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MovieSchema = new Schema({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    description :{
        type: String,
    },
    year:{
        type: Number,
        min: 0,
        max: 2100,
    },
    genre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MovieGenre'
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
    },
    director:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'People'
    },
    actors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'People'
    }],
});

module.exports = mongoose.model("Movie", MovieSchema);