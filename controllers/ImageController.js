const ImageService = require("../services/ImageService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
    await ImageService.test(request, response);
};

exports.create = async (request, response) => {
    isAdministrator(request, response);
    await ImageService.createImage(request, response);
};

exports.upload = async (request, response) => {
    isAdministrator(request, response);
    await ImageService.uploadImage(request, response);
};

exports.getOne = async (request, response) => {
    isAuthorized(request, response);
    await ImageService.getImage(request, response);
};

exports.getAll = async (request, response) => {
    isAuthorized(request, response);
    await ImageService.allImages(request, response);
};

exports.update = async (request, response) => {
    isAdministrator(request, response);
    await ImageService.updateImage(request, response);
};

exports.delete = async (request, response) => {
    isAdministrator(request, response);
    await ImageService.deleteImage(request, response);
};

exports.getValueOf = async (request, response) => {
    await ImageService.distinctValues(request, response);
};

exports.stream = async (request, response) => {
    await ImageService.streamImage(request, response);
};

exports.filterAll = async (request, response) => {
    isAuthorized(request, response);
    await ImageService.getImagesWithParameters(request, response);
};