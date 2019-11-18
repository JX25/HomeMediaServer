const middlewareUtil = require('../utils/middlewareUtil');

module.exports = (req, res) => {
    try{
        req.userData = middlewareUtil.decodeToken(req);
    } catch(error){
        return res.status(401).json({
            info: "Authorization failed. Please login"
        })
    }
}