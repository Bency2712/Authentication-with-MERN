import mongoose, { mongo } from "mongoose";

//define user models
const User= mongoose.model('User',new mongoose.Schema({
    email: {type:String, unique:true},
    password: {type: String},
}));

export default User;