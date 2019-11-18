const MusicService = require("../services/MusicService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) =>{
    await MusicService.test(request, response);
};

exports.create = async (request, response) =>{
    isAdministrator(request, response);
    await MusicService.createMusic(request, response);
};

exports.upload = async (request, response) =>{
    isAdministrator(request, response);
    await MusicService.uploadMusic(request, response);
};

exports.getOne = async (request, response) =>{
    await MusicService.getMusic(request, response);
};

exports.update = async (request, response) =>{
    isAdministrator(request, response);
    await MusicService.updateMusic(request, response);
};

exports.delete = async (request, response) =>{
    isAdministrator(request, response);
    await MusicService.deleteMusic(request, response);
};

exports.getAll = async (request, response) =>{
    isAuthorized(request, response);
    await MusicService.allMusic(request, response);
};

exports.getAllAgeRate = async (request, response) =>{
    isAuthorized(request, response);
    await MusicService.allMusicAgeRate(request, response);
};

exports.getValueOf = async (request, response) =>{
    await MusicService.distinctValues(request, response);
};

exports.stream = async (request, response) =>{
    //isAuthorized(request, response);
    await MusicService.streamMusic(request, response);
};

exports.filterAll = async (request, response) =>{
    await MusicService.getMusicWithParameters(request, response);
};

