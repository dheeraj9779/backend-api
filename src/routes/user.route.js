const express = require('express');
const user = require('../controllers/userController');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();
const {body} = require('express-validator');
const user_for_valid = require('../controllers/userController');

router.use(function logger (req, res, next) {
    console.log('User logged on: ',new Date().toLocaleString())
    next()
})

router.post('/login',async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(user){
            const passMatch = await bcrypt.compare(password,user.password);
            if(passMatch){
                const access_token = jwt.sign({ email: user.email,name: user.name }, 's$32mysecret', {expiresIn: '1h'});
                //const refresh_token = jwt.sign({ email: user.email,name: user.name }, 's$32mysecret', {expiresIn: '1d'});
                //res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                res.status(200).json({ access_token });
            }
            else{
                return res.status(401).json({message:'Authentication failed.'})
            }
        }
        else{
            return res.status(401).json({message:'No user found with this credentials'})
        }
    }
    catch (error){
        return res.status(401).json({message:error})
    }
    
})

router.post('/signup',async(req,res) => {
    const {name,phone,email,password} = req.body;
    //const hashedPassword = await bcrypt.hash(password,10)
    try{
        const user = new User({
            name,
            email,
            phone,
            password:await bcrypt.hash(password,10)
        });
        await user.save();
        return res.status(201).json({message:'User register successfully.'})
    }
    catch(error){
        return res.status(401).json({message:error})
    }
    
})

//Default route for user
router.get('/', (req, res) => {
    res.send("Hello from the user route")
})

//getting users from db
router.get('/user',async (req,res)=> {
    const user = await User.find();
    res.send(user)
})

//setting cookie for user
router.post('/user', (req, res) => {
    res.cookie('name', req.body.name, { maxAge: 900000})
    res.status(201).json({
        msg:`Hey user setting up cookie for ${req.body.name}`
    })
})

//adding user to db
router.post('/save_user',async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    })
    await user.save()
    res.status(201).json({
        msg:`Hey user ${req.body.name} saved to db`
    })
})


//validation
router.post('/myuser',body('email').isEmail(),user_for_valid)

module.exports = router