
const mongoose=require('mongoose');
const { type } = require('os');
const schema=mongoose.Schema;
const shortLinkSchema=new schema({
userId:{type:String,require:true},
originalLink:{type:String,require:true},
relativeLink:{type:String,require:true},
title:{type:String,require:false},
description:{type:String,require:false},
isEnable:{type:Boolean,require:true},
expireAt:{type:Date,require:false},
createdAt:{type:Date,require:false},
password:{type:String,require:false}
});
const ShortLink=mongoose.model('shortLink',shortLinkSchema);
module.exports=ShortLink;