const Audio = require('../models/AudioModel');
const audioUtil = require('../utils/mediaUtil');
const slug = require('slug');


exports.test = (req, res) => {
    res.status(200).json({
        info: "Audio Controller is working!"
    })
};

exports.createAudio = (req, res) => {
    Audio.find({title: req.body.title, year: req.body.year, album: req.body.album})
    .exec()
    .then(audio =>{
        if(audio.length === 0){
            let newSlug = slug(req.body.title+'_'+req.body.year+'_'+req.body.album)
            let newAudio = new Audio({
                title: req.body.title,
                description: req.body.description,
                author: req.body.author,
                album: req.body.album,
                year: req.body.year,
                genre: req.body.genre,
                tags: req.body.tags,
                language: req.body.language,
                slug: newSlug,
                file_path: process.env.AUDIO_PATH + newSlug,
                thumbnail: process.env.AUDIO_THUMBNAILS + newSlug,
                length: req.body.length,
                age_rate: req.body.age_rate,
                created: Date.now()
            });
            newAudio.save()
                .then( () => {
                    audioUtil.res(res, 201, {msg: "Created Meta Data for Audio", slg: newAudio.slug, thmb: newSlug});
                })
                .catch(error =>{
                    console.log(error);
                    audioUtil.res(res, 500, "Cannot create audio");
                })
        }else{
            audioUtil.res(res, 404, "Audio already exist");
        }
    })
    .catch(error =>{
        audioUtil.res(res, 500, 'Error while searching for Audio ' + error);
    })
};

exports.uploadAudio = (req, res) => {
    Audio.find({slug: req.params.slug})
        .exec()
        .then(audio =>{
            if(audio.length === 1){
                let file = process.env.AUDIO_PATH + req.params.slug;
                audioUtil.upload(req, res, file);
            }else{
                audioUtil.res(res, 409, "Existing two or more videos with same slug");
            }
        })
        .catch(error =>{
            audioUtil.res(res, 404, "Problem with video " + error);
        })
};

exports.uploadThumbnail = (req, res) => {
  Audio.find({slug: req.params.slug})
      .exec()
      .then(audio => {
         if(audio){
             let file = process.env.AUDIO_THUMBNAILS + req.params.slug;
             audioUtil.upload(req, res, file);
         } else{
             audioUtil.res(res, 409, 'Exisitng two or more audio with the same thumbnail');
         }
      })
      .catch(error => {
          audioUtil.res(res, 404, 'Problem with uploading tumbnail', {err: error});
      });
};

exports.getAudio = (req, res) => {
    Audio.find({slug: req.params.slug})
        .exec()
        .then(audio =>{
            if(audio.length === 1){
                audioUtil.res(res, 200, audio[0]);
            }else{
                audioUtil.res(res, 404, "Audio has not been found!");
            }
        })
        .catch(error =>{
            console.log(error);
            audioUtil.res(res, 500, "Internal Error");
        })
};

exports.updateAudio = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    toUpdate[slug] = req.body[slug];
    toUpdate['file_path'] = process.env.AUDIO_PATH + req.body['slug'];
    toUpdate['thumbnail'] = process.env.AUDIO_THUMBNAILS + req.body['slug'];
    Audio.updateOne({slug: toUpdate['OLDslug']}, {$set: toUpdate})
        .exec()
        .then(() =>{
            let result = [];
            if(req.body.OLDslug != req.body.slug){
                try{
                    result.push(audioUtil.renameMedia(process.env.AUDIO_THUMBNAILS + req.body.OLDslug, process.env.AUDIO_THUMBNAILS + req.body.slug));
                    result.push(audioUtil.renameMedia(process.env.AUDIO_PATH + req.body.OLDslug, process.env.AUDIO_PATH + req.body.slug));
                }catch(err){
                    console.log(err)
                }
            }
            result.push('Audio meta data updated');
            audioUtil.res(res, 200, result);
        })
        .catch(error => {
            audioUtil.res(res, 500, error);
        })
};

exports.deleteAudio = (req, res) => {
    Audio.find({slug: req.params.slug})
        .exec()
        .then(audio =>{
            if(audio.length === 1){
                let toDelete = Array(audio[0].file_path);
                audio[0].delete()
                    .then(() =>{
                        for(let file of toDelete){
                            audioUtil.removeMedia(file);
                        }
                        audioUtil.res(res, 200, "Audio deleted from DB and storage")
                    })
                    .catch(error =>{
                        audioUtil.res(res, 500, "Error during deleting audio", {err: error})
                    })
            }else{
                audioUtil.res(res, 404, "Cannot find audio to delete");
            }
        })
        .catch(error => {
            audioUtil.res(res, 500, "Error during searching for video " + error);
        })
};

exports.allAudio = (req, res) => {
    Audio.find()
        .exec()
        .then(audio =>{
            audioUtil.res(res, 200, audio);
        })
        .catch(error =>{
            console.log(error);
            audioUtil.res(res, 500, "Cannot download audio - Error");
        })
};

exports.allAudioAgeRate = (req, res) =>{
    let ageRate = req.userData.age;
    Audio.find({age_rate: {$lte: ageRate}})
        .exec()
        .then( audio => {
            audioUtil.res(res, 200, audio);
        })
        .catch(error =>{
            console.log(error);
            audioUtil.res(res, 500, "Cannot download audio - error");
        })
};

exports.distinctValues = (req, res) => {
    Audio.distinct(req.params.field)
        .exec()
        .then(allFromCategory => {
            audioUtil.res(res, 200, allFromCategory);
        })
        .catch(error =>{
            console.log(error);
            audioUtil.res(res, 500, "Cannot download distinct categories");
        })
  };
  
  exports.streamAudio = (req, res) =>{
      let mediaToStream = process.env.AUDIO_PATH+req.params.slug;
      try{
          audioUtil.streamMedia(res, req, mediaToStream, 'audio/mpeg');
      }catch(error){
          audioUtil.res(res, 500, "Error during streaming audio");
      }
  };

exports.streamThumbnail = (req, res) =>{
    let mediaToStream = process.env.AUDIO_THUMBNAILS+req.params.slug;
    try{
        audioUtil.streamMedia(res, req, mediaToStream , 'image/*');
    }catch(error){
        audioUtil.res(res, 500, "Error during streaming video");
    }
};

  exports.getAudioWithParameters = (req, res) =>{
      let parameters = req.body.parameters;
      Audio.find({parameters})
          .exec()
          .then(audio => {
              if(audio.length > 0){
                  audioUtil.res(res, 200, audio);
              }else{
                audioUtil.res(res, 404, "No audio to fulfil criteria");
              }
          })
          .catch(error =>{
            audioUtil.res(res, 500, "Internal Error" + error);
          })
  };
