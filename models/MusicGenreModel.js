const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MusicGenre = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("MusicGenre", MusicGenre);