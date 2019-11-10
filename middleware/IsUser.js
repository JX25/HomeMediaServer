import '../utils/middlewareUtil';

module.exports = (req, res, next) => {
    try{
        req.userData = decodeToken(req)
        //console.log(decoded);
        next();
    } catch(error){
        return res.status(401).json({
            info: "Authorization failed. Please login"
        })
    }
}