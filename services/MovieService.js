const Movie = require('../models/MovieModel');
const movieUtil = require('../utils/mediaUtil');
const slug = require('slug');


exports.test = (req, res) => {
    res.status(200).json({
        info: "Movie Controller is working!"
    })
};

exports.createMovie = (req, res) => {
    Movie.find({title: req.body.title, year: req.body.year})
        .exec()
        .then(movie =>{
            if(movie.length === 0){
                let newMovie = new Movie({
                    title: req.body.title,
                    description: req.body.description,
                    year: req.body.year,
                    genre: req.body.genre,
                    tags: req.body.tags,
                    language: req.body.language,
                    slug: slug(req.body.title+'_'+req.body.year),
                    file_path: process.env.MOVIE_PATH + slug(req.body.title+'_'+req.body.year),
                    thumbnail: process.env.MOVIE_THUMBNAILS + slug(req.body.title+'_'+req.body.year),
                    length: req.body.length,
                    age_rate: req.body.age_rate,
                    director: req.body.director,
                    actors: req.body.actors,
                    created: Date.now()
                });
                newMovie.save()
                    .then( () => {
                        movieUtil.res(res, 201, {msg: "Created Meta Data for Movie", slg: newMovie.slug});
                    })
                    .catch(error =>{
                        console.log(error);
                        movieUtil.res(res, 500, "Cannot create movie");
                    })
            }else{
                movieUtil.res(res, 404, "Movie already exist");
            }
        })
        .catch(error =>{
            movieUtil.res(res, 500, 'Error while searching for Movie ' + error);
        })
};

exports.uploadMovie = (req, res) =>{
    Movie.find({slug: req.params.slug})
        .exec()
        .then(movie =>{
            if(movie.length === 1){
                let file = process.env.MOVIE_PATH + req.params.slug;
                movieUtil.upload(req, res, file);
            }else{
                movieUtil.res(res, 409, "Existing two or more movies with same slug");
            }
        })
        .catch(error =>{
            movieUtil.res(res, 404, "Problem with movie");
        })
};

exports.uploadThumbnail = (req, res) => {
    Movie.find({slug: req.params.slug})
        .exec()
        .then(movie =>{
            if(movie.length === 1){
                let file = process.env.MOVIE_THUMBNAILS + req.params.slug;
                movieUtil.upload(req, res, file);
            }else{
                movieUtil.res(res, 409, "Existing two or more movies with same thumbnail");
            }
        })
        .catch(error =>{
            movieUtil.res(res, 404, "Problem with movie", {err: error});
        })
};

exports.getMovie = (req, res) => {
    Movie.find({slug: req.params.slug})
        .exec()
        .then(movie =>{
            if(movie.length === 1){
                movieUtil.res(res, 200, movie[0]);
            }else{
                movieUtil.res(res, 404, "Movie has not been found!");
            }
        })
        .catch(error =>{
            console.log(error);
            movieUtil.res(res, 500, "Internal Error");
        })
};

exports.updateMovie = (req, res) => {
    let toUpdate = {};
    for(let param in req.body){
        toUpdate[param] = req.body[param];
    }
    toUpdate[slug] = req.body[slug];
    toUpdate['file_path'] = process.env.MOVIE_PATH + req.body['slug'];
    toUpdate['thumbnail'] = process.env.MOVIE_THUMBNAILS + req.body['slug'];
    Movie.updateOne({slug: toUpdate['OLDslug']}, {$set: toUpdate})
        .exec()
        .then(() =>{
            let result = [];
            if(req.body.OLDslug != req.body.slug){
                try{
                    result.push(movieUtil.renameMedia(process.env.MOVIE_THUMBNAILS + req.body.OLDslug, process.env.MOVIE_THUMBNAILS + req.body.slug));
                    result.push(movieUtil.renameMedia(process.env.MOVIE_PATH + req.body.OLDslug, process.env.MOVIE_PATH + req.body.slug));
                }catch(err){
                    console.log(err)
                }
            }
            result.push('Movie meta data updated');
            movieUtil.res(res, 200, result);
        })
        .catch(error => {
            movieUtil.res(res, 500, error);
        })
};

exports.deleteMovie = (req, res) => {
    Movie.find({slug: req.params.slug})
        .exec()
        .then(movie =>{
            if(movie.length === 1){
                let toDelete = Array(movie[0].file_path,movie[0].thumbnail);
                movie[0].delete()
                    .then(() =>{
                        for(let file of toDelete){
                            movieUtil.removeMedia(file);
                        }
                        movieUtil.res(res, 200, "Movie deleted from DB and storage")
                    })
                    .catch(error =>{
                        movieUtil.res(res, 500, "Error during deleting movie", {err: error})
                    })
            }else{
                movieUtil.res(res, 404, "Cannot find movie to delete");
            }
        })
        .catch(error => {
            movieUtil.res(res, 500, "Error during searching for movie " + error);
        })
};

exports.allMovies = (req, res) => {
    Movie.find()
        .exec()
        .then(movies =>{
            movieUtil.res(res, 200, movies);
        })
        .catch(error =>{
            console.log(error);
            movieUtil.res(res, 500, "Cannot download movies - Error");
        })
};

exports.allMoviesAgeRate =  async (req, res) => {
    let ageRate = req.userData.age;
    Movie.find({age_rate: {$lte: ageRate} })
        .exec()
        .then(movies =>{
            movieUtil.res(res, 200, movies);
        })
        .catch(error =>{
            console.log(error);
            movieUtil.res(res, 500, "Cannot download movies - Error");
        })
};

exports.distinctValues = (req, res) => {
  Movie.distinct(req.params.field)
      .exec()
      .then(allFromCategory => {
          movieUtil.res(res, 200, allFromCategory);
      })
      .catch(error =>{
          console.log(error);
          movieUtil.res(res, 500, "Cannot download distinct categories");
      })
};

exports.streamMovie = (req, res) =>{
    let mediaToStream = process.env.MOVIE_PATH+req.params.slug;
    try{
        movieUtil.streamMedia(res, req, mediaToStream , 'video/mp4');
    }catch(error){
        movieUtil.res(res, 500, "Error during streaming movie");
    }
};

exports.streamThumbnail = (req, res) =>{
    let mediaToStream = process.env.MOVIE_THUMBNAILS+req.params.slug;
    try{
        movieUtil.streamMedia(res, req, mediaToStream , 'image/*');
    }catch(error){
        movieUtil.res(res, 500, "Error during streaming movie");
    }
};

exports.getMoviesWithParameters = (req, res) =>{
    let parameters = req.body.parameters;
    Movie.find({parameters})
        .exec()
        .then(movies => {
            if(movies.length > 0){
                movieUtil.res(res, 200, photos);
            }else{
                movieUtil.res(res, 404, "No movie to fulfil criteria");
            }
        })
        .catch(error =>{
            movieUtil.res(res, 500, "Internal Error" + error);
        })
};