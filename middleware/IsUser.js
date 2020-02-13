const middlewareUtil = require('../utils/middlewareUtil');

module.exports = (req, res, nick) => {
    try{
        req.userData = middlewareUtil.decodeToken(req);
        if(nick){
            if(req.userData.nickname != nick){
                return res.status(400).json({
                    info: "You are trying to gain access to not your account"
                })
            }
        }
    } catch(error){
        return res.status(401).json({
            info: "Authorization failed. Please login"
        })
    }
};