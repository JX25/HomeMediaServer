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
        type: String,
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'MovieGenre'
    },
    tags:[{
        type: String,
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'Tag'
    }],
    language:{
        type: String
    },
    slug:{
        type: String,
        unique: true,
        required: true
    },
    thumbnail:{
      type: String
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
    director:[{
        type: String,
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'People'
    }],
    actors:[{
        type: String,
        //type: mongoose.Schema.Types.ObjectId,
        //ref: 'People'
    }],
    created: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Movie", MovieSchema);