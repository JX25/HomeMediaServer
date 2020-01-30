const VideoService = require("../services/VideoService");
const VideoUtil = require("../utils/mediaUtil");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
  await VideoService.test(request, response);
};

exports.create = async (request, response) => {
    isAdministrator(request, response);
    await VideoService.createVideo(request, response);
};

exports.upload = async (request, response) => {
    isAdministrator(request, response);
    VideoUtil.checkFreeSpace(request, response, process.env.VIDEO_PATH, request.headers['Content-Length']);
    await VideoService.uploadVideo(request, response);
};

exports.getOne = async (request, response) => {
    isAuthorized(request, response);
    await VideoService.getVideo(request, response);
};

exports.update = async (request, response) => {
    isAdministrator(request, response);
    await VideoService.updateVideo(request, response);
};

exports.delete = async (request, response) => {
    isAdministrator(request, response);
    await VideoService.deleteVideo(request, response);
};

exports.getAll = async (request, response) => {
    isAuthorized(request, response);
    await VideoService.allVideos(request, response);
};

exports.getAllAgeRate = async (request, response) =>{
    isAuthorized(request, response);
    await VideoService.allVideosAgeRate(request, response);
};

exports.getValueOf = async (request, response) => {
    await VideoService.distinctValues(request, response);
};

exports.stream = async (request, response) => {
    //isAuthorized(request, response);
    await VideoService.streamVideo(request, response);
};

exports.streamThumbnail = async (request, response) => {
    //isAuthorized(request, response);
    await VideoService.streamThumbnail(request, response);
};

exports.filterAll = async (request, response) => {
    isAuthorized(request, response);
    await VideoService.getVideosWithParameters(request, response);
};

exports.thumbnail = async (request, response) => {
    isAdministrator(request, response);
    await VideoService.uploadThumbnail(request, response)
};



