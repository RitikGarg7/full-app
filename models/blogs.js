
var express=require('express');
var app=express();
var mongoose=require('mongoose');


var commentSchema=new mongoose.Schema({
    author:String,
    about:String
});

var blogSchema=new mongoose.Schema({
     title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now},
    comments:[commentSchema]
});





module.exports=mongoose.model("Blog",blogSchema);