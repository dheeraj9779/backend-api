const {validationResult} = require('express-validator');
const user = (req, res) => {
    console.log(req.cookies)
    res.status(201).json({
        msg:"Hello from user"
    })
}

const user_for_valid =  (req, res) => {
    const error = validationResult(req);
    console.log(error)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    return res.status(200).json({"msg":"No error"})
}

module.exports = user
module.exports = user_for_valid