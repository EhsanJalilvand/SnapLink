const mongoose = require('mongoose');
const { type } = require('os');
const schmea = mongoose.Schema;
const userSchema = new schmea(
    {
        displayName: { type: String, require: true },
        email: { type: String, require: true },
        password: String,
        isVerified:{type:Boolean,require:true,default:false},
        verificationToken: String
    });
const User=mongoose.model('User',userSchema);

module.exports=User;