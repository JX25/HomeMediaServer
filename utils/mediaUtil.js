const upload = require("express-fileupload");
const People = require('../models/PeopleModel');
const Genre = require('../models/MovieGenreModel');
const Tag = require('../models/TagModel');
const fs = require('fs');

exports.res = (response, code, message) =>{
    return response.status(code).json({
        response: message
    })
};

exports.upload = ( req, res, filepath) =>{
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) =>{
        let fstream = fs.createWriteStream(filepath);
        file.pipe(fstream);
        fstream.on('close', () =>{
            this.res(res, 200, "Movie uploaded");
        });
    });
};

exports.removeMedia = (filepath) =>{
    fs.unlink(filepath, (err) =>{
        if(err) {
            console.log(err);
        }
    });
};


exports.getPeopleIds = (people) => {
    this.addToCollection(people, People);
    People.find()
        .exec()
        .then(allPeople =>{
            let list = [];
            for(let person of allPeople){
                if(people.indexOf(person.name) != -1){
                    list.push(person._id);
                }
            }
            console.log(list);
            return list;
        })
        .catch(error =>{
            console.log(error);
        })
};

exports.getTagsIds = (tags) => {

};

exports.getGenresIds = (genre) => {

};

exports.addToCollection = (names, Model) =>{
    for(let n of names){
        let obj = new Model({name: n});
        try {
            obj.save();
        }catch(error){
            console.log(error);
        }
    }
};
