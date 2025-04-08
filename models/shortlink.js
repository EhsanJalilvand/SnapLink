
const mongoose=require('mongoose');
const { type } = require('os');
const schema=mongoose.Schema;
const shortLinkSchema=new schema({
userId:{type:String,require:true},
originalLink:{type:String,require:true},
relativeLink:{type:String,require:true},
isEnable:{type:Boolean,require:true},
expiredDateTime:{type:Date,require:false},
password:{type:String,require:false}
});
const ShortLink=mongoose.model('shortLink',shortLinkSchema);
module.exports=ShortLink;