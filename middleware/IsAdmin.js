const User = require('../models/UserModel');
const middlewareUtil = require('../utils/middlewareUtil');

module.exports = (req, res, next) => {
    try{
        req.userData = middlewareUtil.decodeToken(req);
        User.find({
            email: req.userData['email'],
            is_admin: true
        })
            .exec()
            .then(user=>{
                if(user.length === 1){
                    return;//next();
                } else {
                    return middlewareUtil.unauthorized(res, 401, "Admin authorization failed")
                }
            })
    }catch(error){
        return middlewareUtil.unauthorized(res, 401, "Authorization failed");
    }
};