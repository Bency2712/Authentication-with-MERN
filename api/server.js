import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import User from  './models/User.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';


//secret/private key for jwt
const secret = 'secret123';
//connect to database
await mongoose.connect('mongodb://localhost:27017/auth');

//get the connection
const db = mongoose.connection;
//log the error
db.on('error',console.log);

//define the app
const app = express();

// cookieParser and bodyParser function 
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));

app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000',
}));

//to check if it works
app.get('/',(req,res) => {
    res.send('ok');
})

//Define endpoint to get the user from the token
app.get('/user', (req,res) => {
    const payload= jwt.verify(req.cookies.token, secret);
    //we should get both id and email in payload
    User.findById(payload.id)
    .then(userInfo => {
        res.json({id:userInfo._id,email:userInfo.email});
    });
})

//To handle register callback, we will do app.post
app.post('/register', (req,res) => {
    const{email,password} = req.body;
    //to encrypt the password, we can either use hash or hashsync, which will wait for the password to be hashed first. Here 10 indicates how many rounds the password will be hashed
    const hashedPassword = bcrypt.hashSync(password,10);
    const user=new User({password:hashedPassword, email});
    user.save().then(userInfo =>{
        //create a token which we can use to authenticate. we can use jwt library
        //we will use sign function and pass payload inside it. payload will be the id of the user
        //the next parameter is secret or private key to hide/encode our information
        //then we can callback. err as the first oaram and token as the second
        jwt.sign({id:userInfo._id, email: userInfo.email}, secret,(err,token) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }
            else{
                //we want to send a token inside a cookie
                //name of the cookie is token and the value is inside the token variable
                //to give more information, we will use the json function, where we can send the id of the user
                res.cookie('token',token).json({id:userInfo._id, email: userInfo.email});
            }
        })
    });
});


app.post ('/login', (req,res) => {
    const {email,password} = req.body;
    User.findOne({email})
    .then(userInfo => {
        const passOk = bcrypt.compareSync(password, userInfo.password);
        //if the password is Ok, we want to do sign a new json web token and send it with the response

        if(passOk){
            jwt.sign({id: userInfo._id,email},secret, (err,token) => {
                if(err)
                {
                    console.log(err);
                    res.sendStatus(500);
                }
                else{
                    res.cookie('token',token).json({id:userInfo._id, email: userInfo.email});
                }
            })
        }
        else{
            res.sendStatus(401);
        }
    })

});

app.post('/logout', (req,res) => {
    res.cookie('token','').send();
});

//listen at port 4000
app.listen(4000);