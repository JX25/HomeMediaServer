const Photo = require('../models/PhotoModel');
const photoUtil = require('../utils/mediaUtil');
const slug = require('slug');

exports.test = (req, res) => {
    res.status(200).json({
        info: "Photo Controller is working!"
    })
};

exports.createPhoto = (res, req) => {
    Photo.find({title: req.body.title})
        .exec()
        .then(photo =>{
            if(photo.length === 0){
                let newPhoto = new Photo({
                    title: req.body.title,
                    timestamp: req.body.timestamp,
                    tags: req.body.tags,
                    slug: slug(req.body.title + req.body.timestamp),
                    file_path: process.env.PHOTO_PATH + slug(req.body.title + req.body.timestamp),
                    width: req.body.width,
                    height: req.height.height,
                    description: req.body.description
                });
                newPhoto.save()
                    .then( () =>{
                        photoUtil.res(res, 201, {msg: "Created Meta Data for Photo", slg: newPhoto.slug});
                    })
                    .catch(error =>{
                        photoUtil.res(res, 500, "Error while creating metadata for photo");
                    })
            }else{
                photoUtil.res(res, 409, "Photo with this title aleready exist");
            }
        })
        .catch(error =>{
            photoUtil.res(res, 500, "Error while searching photo DB" + error);
        })
};

exports.uploadPhoto = (res, req) =>{
    Photo.find({slug: req.params.slug})
        .exec()
        .then(photo =>{
            if(photo.length === 1){
                let file = process.env.PHOTO_PATH + req.params.slug;
                photoUtil.upload(req, res, file);
            }else{
                photoUtil.res(res, 409, "Existing two or more photos with same slug");
            }
        })
        .catch(error =>{
            photoUtil(res, 500, "Problem with photo" + error)
        })
};

exports.getPhoto = (req, res) => {
    Photo.find({slug :req.params.slug})
        .exec()
        .then(photo =>{
            if(photo.length === 1){
                photoUtil.res(res, 200, photo[0]);
            }else{
                photoUtil.res(res, 409, "More than one photo with this title+timestamp!")
            }
        })
        .catch(error =>{
            photoUtil.res(res, 500, "Internal Error " + error);
        })

};

exports.updatePhoto = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    Photo.updateOne({slug: req.params.slug}, {$set: toUpdate})
        .exec()
        .then(() =>{
            movieUtil.res(res, 200, "Photo data updated");
        })
        .catch(error => {
            movieUtil.res(res, 500, error);
        })
};

exports.deletePhoto = () => {
    Photo.find({slug: req.params.slug})
        .exec()
        .then(photo =>{
            if(photo.length === 1){
                let toDelete = photo[0].file_path;
                photo[0].delete()
                    .then(() =>{
                        photoUtil.removeMedia(toDelete);
                        return movieUtil.res(res, 200, "Photo deleted from DB and storage")
                    })
                    .catch(error =>{
                        return photoUtil.res(res, 500, "Error during deleting photo")
                    })
            }else{
                return photoUtil.res(res, 404, "Cannot find photo to delete");
            }
        })
        .catch(error => {
            photoUtil.res(res, 500, "Error during searching for photo " + error);
        })
};

exports.allPhotos = () => {
    Photo.find()
        .exec()
        .then(photos =>{
            photoUtil.res(res, 200, photos);
        })
        .catch(error =>{
            console.log(error);
            photoUtil.res(res, 500, "Cannot download photos - Error");
        })
};

exports.distinctValues = (req, res) => {
    Photo.distinct(req.params.field)
        .exec()
        .then(allFromCategory => {
            photoUtil.res(res, 200, allFromCategory);
        })
        .catch(error =>{
            console.log(error);
            photoUtil.res(res, 500, "Cannot download distinct categories");
        })
  };

  exports.streamPhoto = (req, res) =>{
    let mediaToStream = process.env.PHOTO_PATH+req.params.slug;
    try{
        photoUtil.streamMedia(res, mediaToStream);
    }catch(error){
        photoUtil.res(res, 500, "Error during streaming photo");
    }
};

exports.getPhotosWithParameters = (req, res) =>{
    let parameters = req.body.parameters;
    Photo.find({parameters})
        .exec()
        .then(photos => {
            if(photos.length > 0){
                photoUtil.res(res, 200, photos);
            }else{
                photoUtil.res(res, 404, "No photo to fulfil criteria");
            }
        })
        .catch(error =>{
            photoUtil.res(res, 500, "Internal Error" + error);
        })
};