const AudioService = require("../services/AudioService");
const AudioUtil = require("../utils/mediaUtil");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) =>{
    await AudioService.test(request, response);
};

exports.create = async (request, response) =>{
    isAdministrator(request, response);
    await AudioService.createAudio(request, response);
};

exports.upload = async (request, response) =>{
    isAdministrator(request, response);
    AudioUtil.checkFreeSpace(request, response, process.env.AUDIO_PATH, request.headers['Content-Length']);
    await AudioService.uploadAudio(request, response);
};

exports.getOne = async (request, response) =>{
    isAuthorized(request, response);
    await AudioService.getAudio(request, response);
};

exports.update = async (request, response) =>{
    isAdministrator(request, response);
    await AudioService.updateAudio(request, response);
};

exports.delete = async (request, response) =>{
    isAdministrator(request, response);
    await AudioService.deleteAudio(request, response);
};

exports.getAll = async (request, response) =>{
    isAuthorized(request, response);
    await AudioService.allAudio(request, response);
};

exports.getAllAgeRate = async (request, response) =>{
    isAuthorized(request, response);
    await AudioService.allAudioAgeRate(request, response);
};

exports.getValueOf = async (request, response) =>{
    await AudioService.distinctValues(request, response);
};

exports.stream = async (request, response) =>{
    //isAuthorized(request, response);
    await AudioService.streamAudio(request, response);
};

exports.streamThumbnail = async (request, response) => {
    //isAuthorized(request, response);
    await AudioService.streamThumbnail(request, response);
};

exports.filterAll = async (request, response) =>{
    isAuthorized(request, response);
    await AudioService.getAudioWithParameters(request, response);
};

exports.thumbnail = async (request, response) => {
    isAdministrator(request, response);
    await AudioService.uploadThumbnail(request, response)
};