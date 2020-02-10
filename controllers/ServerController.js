const ServerService = require("../services/ServerService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
    await ServerService.test(request, response);
};

exports.serverInfo = async (request, response) => {
    //isAdministrator(request, response);
    await ServerService.info(request, response);
};

