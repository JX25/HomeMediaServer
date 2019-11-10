const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MovieGenreSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("MovieGenre", MovieGenreSchema);