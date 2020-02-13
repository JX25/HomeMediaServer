const Video = require('../models/VideoModel');
const videoUtil = require('../utils/mediaUtil');
const slug = require('slug');


exports.test = (req, res) => {
    res.status(200).json({
        info: "Video Controller is working!"
    })
};

exports.createVideo = (req, res) => {
    Video.find({title: req.body.title, year: req.body.year})
        .exec()
        .then(video =>{
            if(video.length === 0){
                let newVideo = new Video({
                    title: req.body.title,
                    description: req.body.description,
                    year: req.body.year,
                    genre: req.body.genre,
                    tags: req.body.tags,
                    language: req.body.language,
                    slug: slug(req.body.title+'_'+req.body.year),
                    file_path: process.env.VIDEO_PATH + slug(req.body.title+'_'+req.body.year),
                    thumbnail: process.env.VIDEO_THUMBNAILS + slug(req.body.title+'_'+req.body.year),
                    length: req.body.length,
                    age_rate: req.body.age_rate,
                    director: req.body.director,
                    actors: req.body.actors,
                    created: Date.now()
                });
                newVideo.save()
                    .then( () => {
                        videoUtil.res(res, 201, {msg: "Created Meta Data for Video", slg: newVideo.slug});
                    })
                    .catch(error =>{
                        console.log(error);
                        videoUtil.res(res, 500, "Cannot create video");
                    })
            }else{
                videoUtil.res(res, 404, "Video already exist");
            }
        })
        .catch(error =>{
            videoUtil.res(res, 500, 'Error while searching for Video ' + error);
        })
};

exports.uploadVideo = (req, res) =>{
    Video.find({slug: req.params.slug})
        .exec()
        .then(video =>{
            if(video.length === 1){
                let file = process.env.VIDEO_PATH + req.params.slug;
                videoUtil.upload(req, res, file);
            }else{
                videoUtil.res(res, 409, "Existing two or more videos with same slug");
            }
        })
        .catch(error =>{
            videoUtil.res(res, 404, "Problem with video");
        })
};

exports.uploadThumbnail = (req, res) => {
    Video.find({slug: req.params.slug})
        .exec()
        .then(video =>{
            if(video.length === 1){
                let file = process.env.VIDEO_THUMBNAILS + req.params.slug;
                videoUtil.upload(req, res, file);
            }else{
                videoUtil.res(res, 409, "Existing two or more videos with same thumbnail");
            }
        })
        .catch(error =>{
            videoUtil.res(res, 404, "Problem with video", {err: error});
        })
};

exports.getVideo = (req, res) => {
    Video.find({slug: req.params.slug})
        .exec()
        .then(video =>{
            if(video.length === 1){
                videoUtil.res(res, 200, video[0]);
            }else{
                videoUtil.res(res, 404, "Video has not been found!");
            }
        })
        .catch(error =>{
            console.log(error);
            videoUtil.res(res, 500, "Internal Error");
        })
};

exports.updateVideo = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    toUpdate[slug] = req.body[slug];
    toUpdate['file_path'] = process.env.VIDEO_PATH + req.body['slug'];
    toUpdate['thumbnail'] = process.env.VIDEO_THUMBNAILS + req.body['slug'];
    Video.updateOne({slug: toUpdate['OLDslug']}, {$set: toUpdate})
        .exec()
        .then(() =>{
            let result = [];
            if(req.body.OLDslug != req.body.slug){
                try{
                    result.push(videoUtil.renameMedia(process.env.VIDEO_THUMBNAILS + req.body.OLDslug, process.env.VIDEO_THUMBNAILS + req.body.slug));
                    result.push(videoUtil.renameMedia(process.env.VIDEO_PATH + req.body.OLDslug, process.env.VIDEO_PATH + req.body.slug));
                }catch(err){
                    console.log(err)
                }
            }
            result.push('Video meta data updated');
            videoUtil.res(res, 200, result);
        })
        .catch(error => {
            videoUtil.res(res, 500, error);
        })
};

exports.deleteVideo = (req, res) => {
    Video.find({slug: req.params.slug})
        .exec()
        .then(video =>{
            if(video.length === 1){
                let toDelete = Array(video[0].file_path,video[0].thumbnail);
                video[0].delete()
                    .then(() =>{
                        for(let file of toDelete){
                            videoUtil.removeMedia(file);
                        }
                        videoUtil.res(res, 200, "Video deleted from DB and storage")
                    })
                    .catch(error =>{
                        videoUtil.res(res, 500, "Error during deleting video", {err: error})
                    })
            }else{
                videoUtil.res(res, 404, "Cannot find video to delete");
            }
        })
        .catch(error => {
            videoUtil.res(res, 500, "Error during searching for video " + error);
        })
};

exports.allVideos = (req, res) => {
    Video.find()
        .exec()
        .then(videos =>{
            videoUtil.res(res, 200, videos);
        })
        .catch(error =>{
            console.log(error);
            videoUtil.res(res, 500, "Cannot download videos - Error");
        })
};

exports.allVideosAgeRate =  async (req, res) => {
    let ageRate = req.params.agerate;
    Video.find({age_rate: {$lte: ageRate} })
        .exec()
        .then(videos =>{
            videoUtil.res(res, 200, videos);
        })
        .catch(error =>{
            console.log(error);
            videoUtil.res(res, 500, "Cannot download videos - Error");
        })
};

exports.distinctValues = (req, res) => {
  Video.distinct(req.params.field)
      .exec()
      .then(allFromCategory => {
          videoUtil.res(res, 200, allFromCategory);
      })
      .catch(error =>{
          console.log(error);
          videoUtil.res(res, 500, "Cannot download distinct categories");
      })
};

exports.streamVideo = (req, res) =>{
    let mediaToStream = process.env.VIDEO_PATH+req.params.slug;
    try{
        videoUtil.streamMedia(res, req, mediaToStream , 'video/mp4');
    }catch(error){
        videoUtil.res(res, 500, "Error during streaming video");
    }
};

exports.streamThumbnail = (req, res) =>{
    let mediaToStream = process.env.VIDEO_THUMBNAILS+req.params.slug;
    try{
        videoUtil.streamMedia(res, req, mediaToStream , 'image/*');
    }catch(error){
        videoUtil.res(res, 500, "Error during streaming video");
    }
};

exports.getVideosWithParameters = (req, res) =>{
    let parameters = req.body.parameters;
    Video.find({parameters})
        .exec()
        .then(videos => {
            if(videos.length > 0){
                videoUtil.res(res, 200, videos);
            }else{
                videoUtil.res(res, 404, "No video to fulfil criteria");
            }
        })
        .catch(error =>{
            videoUtil.res(res, 500, "Internal Error" + error);
        })
};