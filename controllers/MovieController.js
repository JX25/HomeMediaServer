const MovieService = require("../services/MovieService");
const MovieUtil = require("../utils/mediaUtil");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
  await MovieService.test(request, response);
};

exports.create = async (request, response) => {
    isAdministrator(request, response);
    await MovieService.createMovie(request, response);
};

exports.upload = async (request, response) => {
    isAdministrator(request, response);
    MovieUtil.checkFreeSpace(request, response, process.env.MOVIE_PATH, request.headers['Content-Length']);
    await MovieService.uploadMovie(request, response);
};

exports.getOne = async (request, response) => {
    isAuthorized(request, response);
    await MovieService.getMovie(request, response);
};

exports.update = async (request, response) => {
    isAdministrator(request, response);
    await MovieService.updateMovie(request, response);
};

exports.delete = async (request, response) => {
    isAdministrator(request, response);
    await MovieService.deleteMovie(request, response);
};

exports.getAll = async (request, response) => {
    isAuthorized(request, response);
    await MovieService.allMovies(request, response);
};

exports.getAllAgeRate = async (request, response) =>{
    isAuthorized(request, response);
    await MovieService.allMoviesAgeRate(request, response);
};

exports.getValueOf = async (request, response) => {
    await MovieService.distinctValues(request, response);
};

exports.stream = async (request, response) => {
    //isAuthorized(request, response);
    await MovieService.streamMovie(request, response);
};

exports.filterAll = async (request, response) => {
    isAuthorized(request, response);
    await MovieService.getMoviesWithParameters(request, response);
};



