const UserService = require("../services/UserService");
const isAuthorized = require("../middleware/IsUser");
const isAdministrator = require("../middleware/IsAdmin");
const isMainAdministrator = require("../middleware/IsMainAdmin");
const midUtil = require("../utils/middlewareUtil");
const userUtil =  require("../utils/userUtil");
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
    if(!request.params.isAdmin){
        const decoded = midUtil.decodeToken(request);
        if(request.params.nickname === decoded.nickname){
            await UserService.updateUser(request, response);
        }else{
            userUtil.res(response, 401, "Cannot delete another user by normal user")
        }
    }else{
        if(request.params.nickname != "administrator"){
            isAdministrator(request, response);
        }else{
            isMainAdministrator(request, response);
        }
        await UserService.updateUser(request, response);
    }
    /*isAuthorized(request, response);
    await UserService.updateUser(request, response);*/
};

exports.delete = async (request, response) => {
    if(!request.params.isAdmin){
        const decoded = midUtil.decodeToken(request);
        if(request.params.nickname === decoded.nickname){
            await UserService.deleteUser(request, response);
        }else{
            userUtil.res(response, 401, "Cannot delete another user by normal user")
        }
    }else{
        if(request.params.nickname != "administrator"){
            isAdministrator(request, response);
        }else{
            isMainAdministrator(request, response);
        }
        await UserService.deleteUser(request, response);
    }
};

exports.getAll = async (request, response) => {
    isAdministrator(request, response);
    await UserService.getUsers(request, response, false);
};

exports.getAllAdmins = async (request, response) => {
    isMainAdministrator(request, response);
    await UserService.getUsers(request, response, true);
};

exports.resetPassword = async (request, response) => {
    isAuthorized(request, response, request.params.nickname);
    await UserService.resetPassword(request, response);
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