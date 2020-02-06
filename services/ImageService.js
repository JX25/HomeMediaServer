const Image = require('../models/ImageModel');
const imageUtil = require('../utils/mediaUtil');
const slug = require('slug');
const sharp = require('sharp');
exports.test = (req, res) => {
    res.status(200).json({
        info: "Image Controller is working!"
    })
};

exports.createImage = (req, res) => {
    Image.find({title: req.body.title, timestamp: req.body.timestamp})
        .exec()
        .then(image =>{
            if(image.length === 0){
                let newSlug = slug(req.body.title + "_" + req.body.timestamp);
                let newImage = new Image({
                    title: req.body.title,
                    timestamp: req.body.timestamp,
                    tags: req.body.tags,
                    collections: req.body.collection,
                    slug: newSlug,
                    file_path: process.env.PHOTO_PATH + newSlug,
                    thumbnail_path: process.env.PHOTO_THUMBNAILS + newSlug,
                    width: req.body.width,
                    height: req.body.height,
                    description: req.body.description
                });
                newImage.save()
                    .then( () =>{
                        imageUtil.res(res, 201, {msg: "Created Meta Data for Image", slg: newImage.slug});
                    })
                    .catch(error =>{
                        console.log(error)
                        imageUtil.res(res, 500, "Error while creating metadata for image " + error);
                    })
            }else{
                imageUtil.res(res, 409, "Image with this title aleready exist");
            }
        })
        .catch(error =>{
            console.log(error);
            imageUtil.res(res, 500, "Error while searching image DB" + error);
        })
};

exports.uploadImage = (req, res) =>{
    Image.find({slug: req.params.slug})
        .exec()
        .then(image =>{
            if(image.length === 1){
                let file = process.env.PHOTO_PATH + req.params.slug;
                imageUtil.upload(req, res, file);
            }else{
                imageUtil.res(res, 409, "Existing two or more images with same slug");
            }
        })
        .catch(error =>{
            imageUtil(res, 500, "Problem with image" + error)
        })
};

exports.getImage = (req, res) => {
    Image.find({slug :req.params.slug})
        .exec()
        .then(image =>{
            if(image.length === 1){
                imageUtil.res(res, 200, image[0]);
            }else{
                imageUtil.res(res, 409, "More than one image with this title+timestamp!")
            }
        })
        .catch(error =>{
            imageUtil.res(res, 500, "Internal Error " + error);
        })

};

exports.updateImage = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    Image.updateOne({slug: req.params.slug}, {$set: toUpdate})
        .exec()
        .then(() =>{
            imageUtil.res(res, 200, "Image data updated");
        })
        .catch(error => {
            imageUtil.res(res, 500, error);
        })
};

exports.deleteImage = (req, res) => {
    Image.find({slug: req.params.slug})
        .exec()
        .then(image =>{
            if(image.length === 1){
                let toDelete = image[0].file_path;
                image[0].delete()
                    .then(() =>{
                        imageUtil.removeMedia(toDelete);
                        return imageUtil.res(res, 200, "Image deleted from DB and storage");
                    })
                    .catch(error =>{
                        return imageUtil.res(res, 500, "Error during deleting image " + error);
                    })
            }else{
                return imageUtil.res(res, 404, "Cannot find image to delete");
            }
        })
        .catch(error => {
            imageUtil.res(res, 500, "Error during searching for image " + error);
        })
};

exports.allImages = (req, res) => {
    Image.find()
        .exec()
        .then(images =>{
            imageUtil.res(res, 200, images);
        })
        .catch(error =>{
            console.log(error);
            imageUtil.res(res, 500, "Cannot download images - Error");
        })
};

exports.distinctValues = (req, res) => {
    Image.distinct(req.params.field)
        .exec()
        .then(allFromCategory => {
            imageUtil.res(res, 200, allFromCategory);
        })
        .catch(error =>{
            console.log(error);
            imageUtil.res(res, 500, "Cannot download distinct categories");
        })
  };

  exports.streamImage = (req, res) =>{
    let mediaToStream = process.env.PHOTO_PATH+req.params.slug;
    try{
        imageUtil.streamMedia(res, req, mediaToStream, 'image/jpeg');
    }catch(error){
        imageUtil.res(res, 500, "Error during streaming image");
    }
};

exports.getImagesWithParameters = (req, res) =>{
    let parameters = req.body.parameters;
    Image.find({parameters})
        .exec()
        .then(images => {
            if(images.length > 0){
                imageUtil.res(res, 200, images);
            }else{
                imageUtil.res(res, 404, "No image to fulfil criteria");
            }
        })
        .catch(error =>{
            imageUtil.res(res, 500, "Internal Error" + error);
        })
};