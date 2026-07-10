const mongoose = require("mongoose");
const { modelName } = require("./listing");
const Schema = mongoose.Schema;
const User=require("./user.js");

const reviewsschema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },

    createdat:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model("review",reviewsschema);