const jwt = require('jsonwebtoken');

exports.decodeToken = (request) => {
    let token = request.header('Authorization').split(' ');
    return jwt.verify(token[1], 'secret');
};

exports.unauthorized = (response, code, message) =>{
    return response.status(code).json({
        info: message
    })
};