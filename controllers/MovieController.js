const Movie = require('../models/MovieModel');
const Genre = require('../models/MovieGenreModel');
const People = require('../models/PeopleModel');
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
                    length: req.body.length,
                    age_rate: req.body.age_rate,
                    director: req.body.director,
                    actors: req.body.actors,
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
            movieUtil.res(res, 500, 'asdsaas' + error);
        })
};

exports.uploadMovie = (req, res) =>{
    Movie.find({slug: req.params.slug})
        .exec()
        .then(movie =>{
            if(movie.length === 1){
                let file = process.env.MOVIE_PATH + req.params.slug;
                movieUtil.upload(req, res, file)
            }else{
                movieUtil.res(res, 409, "Existing two or more movies with same slug");
            }
        })
        .catch(error =>{
            movieUtil.res(res, 404, "Problem with movie");
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
    Movie.updateOne({slug: req.params.slug}, {$set: toUpdate})
        .exec()
        .then(() =>{
            movieUtil.res(res, 200, "Movie updated");
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
                let toDelete = movie[0].file_path;
                movie[0].delete()
                    .then(() =>{
                        movieUtil.removeMedia(toDelete);
                        return movieUtil.res(res, 200, "Movie deleted from DB and storage")
                    })
                    .catch(error =>{
                        return movieUtil.res(res, 500, "Error during deleting movie")
                    })
            }else{
                return movieUtil.res(res, 404, "Cannot find movie to delete");
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

exports.allMoviesAgeRate = (req, res) => {
    let ageRate = 'from_token'
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