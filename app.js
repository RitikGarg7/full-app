var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine",".ejs");
app.use(express.static("public"));




// mongodb+srv://ritik7garg:<password>@cluster0-mytqa.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://ritik7garg:heroku12641garg@cluster0-mytqa.mongodb.net/full-app");


var userSchema=new mongoose.Schema({
    username:"String",
    password:"String"
});

var User=mongoose.model("User",userSchema);
// User.create({
//     username:'rahul@gmail.com',
//     password:'rohit123'
// },function(err,created) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(created);
//     }
// });



app.get("/",function(req,res) {
  //  res.render("index.ejs");
    User.find({},function(err,found) {
        if(err) {
            console.log(err);
        } else {
           // console.log(found);
            res.render("index.ejs",{found:found});
        }
    })
});

app.post("/",function(req,res) {
    var newuser=new User({
        username:req.body.username,
        password:req.body.password
    });
    newuser.save(function(err,saved) {
        if(err) {
            console.log(err);
        } else {
            console.log(saved);
        }
    });
    res.redirect("/");
})


app.listen(process.env.PORT || 4444,function() {
    console.log("server started");
})