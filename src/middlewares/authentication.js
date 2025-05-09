const jwt = require('jsonwebtoken')

function verifyToken(req,res,next){
    const accesstoken = req.header('Authorization')
    //const refreshToken = req.cookies['refreshToken'];
    if(accesstoken){
        try{
           const decoded =  jwt.verify(accesstoken,'s$32mysecret');
           req.email = decoded.email
           next();
        }
        catch(error){
            return res.status(401).json({message:'Invalid Token'})
        }
    }
    else{
        return res.status(401).json({message:'Access Denied'})
    }
}

module.exports = verifyToken;