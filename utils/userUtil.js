exports.res = (response, code, message) =>{
    return response.status(code).json({
        response: message
    })
};