const PhotoService = require("../services/PhotoService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
    await PhotoService.test(request, response);
};

exports.create = async (request, response) => {
    isAdministrator(request, response);
    await PhotoService.createPhoto(request, response);
};

exports.upload = async (request, response) => {
    isAdministrator(request, response);
    await PhotoService.uploadPhoto(request, response);
};

exports.getOne = async (request, response) => {
    isAuthorized(request, response);
    await PhotoService.getPhoto(request, response);
};

exports.getAll = async (request, response) => {
    isAuthorized(request, response);
    await PhotoService.allPhotos(request, response);
};

exports.update = async (request, response) => {
    isAdministrator(request, response);
    await PhotoService.updatePhoto(request, response);
};

exports.delete = async (request, response) => {
    isAdministrator(request, response);
    await PhotoService.deletePhoto(request, response);
};

exports.getValueOf = async (request, response) => {
    await PhotoService.distinctValues(request, response);
};

exports.stream = async (request, response) => {
    await PhotoService.streamPhoto(request, response);
};

exports.filterAll = async (request, response) => {
    isAuthorized(request, response);
    await PhotoService.getPhotosWithParameters(request, response);
};