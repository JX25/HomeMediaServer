const UserService = require("../services/UserService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");

exports.test = async (request, response) => {
    await UserService.test(request, response);
};

exports.create = async (request, response) => {
    await UserService.createUser(request, response);
};

exports.getOne = async (request, response) => {
    isAuthorized(request, response);
    await UserService.getUser(request, response);
};

exports.update = async (request, response) => {
    isAuthorized(request, response);
    await UserService.updateUser(request, response);
};

exports.delete = async (request, response) => {
    isAuthorized(request, response);
    await UserService.deleteUser(request, response);
};

exports.getAll = async (request, response) => {
    isAdministrator(request, response);
    await UserService.getUsers(request, response);
};

exports.ressetPassword = async (request, response) => {
    isAdministrator(request, response);
    await UserService.resetPasswordByAdmin(request, response);
};

exports.createAdmin = async (request, response) => {
    isAdministrator(request, response);
    await UserService.addAdmin(request, response);
};

exports.login = async (request, response) => {
    await UserService.login(request, response);
};

exports.logout = async (request, response) => {
    await UserService.logout(request, response);
};