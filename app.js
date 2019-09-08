var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var User        = require("./models/user");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var Blog           =require('./models/blogs');
var methodOverride = require("method-override");
var nodemailer=require('nodemailer');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine",".ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



// mongodb+srv://ritik7garg:<password>@cluster0-mytqa.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://ritik7garg:heroku12641garg@cluster0-mytqa.mongodb.net/full-app");




// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

// MONGOOSE/MODEL CONFIG

// RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/indexall");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {

          res.render("index", {blogs: blogs}); 
       }
   });
});

app.get("/indexall",function(req,res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
 
           res.render("indexall", {blogs: blogs}); 
        }
    });})

// NEW ROUTE
app.get("/blogs/new",isLoggedIn, function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs",isLoggedIn, function(req, res){
   var newblog={
       title:req.body.title,
       image:req.body.image,
       body:req.body.body
   }

   Blog.create(newblog,function(err,created) {
       if(err) {
           console.log(err);
       } else {
           console.log(created);
           created.save();
           res.redirect("/blogs");
       }
   })
});

// SHOW ROUTE
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id,function(err, found){
        if(err){
            console.log(err);
        } else {
            console.log(found)
            //render show template with that blog
            res.render("show.ejs", {found: found});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});


// UPDATE ROUTE
app.put("/blogs/:id",isLoggedIn, function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});



// DELETE ROUTE
app.delete("/blogs/:id",isLoggedIn, function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});

//comments

app.post("/blogs/:id/comments",function(req,res) {
    var newcomment={
        author:req.body.author,
        about:req.body.about
    }
    Blog.findById(req.params.id,function(err,found) {
        if(err) {
            console.log(err);
        } else {
            console.log(found);
            console.log('=========');
            found.comments.push(newcomment);
            console.log(newcomment);
            console.log('==========');
            console.log(found);
            found.save();
            
            res.render("show.ejs",{found:found});
        }
    });
})



app.get("/contact",function(req,res) {
    res.render("contact.ejs");
})

app.post("/contact",function(req,res) {
    var name=req.body.name;
    var username=req.body.username;
   
    var message=req.body.message;
  
      var transporter=nodemailer.createTransport({
          service:'Gmail',
          auth:{
              user:'ritikonlyuse@gmail.com',
              pass:'ritikonlyuse12345'
          }
      });
      var mailOptions={
          from:username,
          to:'ritikonlyuse@gmail.com',
         
          text:message
      };
  
      transporter.sendMail(mailOptions,function(err,sent) {
          if(err) {
              console.log(err);
          } else {
              console.log(sent);
              res.redirect("/contact");
          }
      })
  
      
  })

  // show register form
app.get("/register", function(req, res){
    res.render("register"); 
 });
 //handle sign up logic
 app.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/blogs"); 
         });
     });
 });




 // show login form
app.get("/login", function(req, res){
    res.render("login"); 
 });
 // handling login logic
 app.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/blogs",
         failureRedirect: "/login"
     }), function(req, res){
 });




  app.get("/login",function(req,res) {
      res.render("login.ejs");
  });





  // logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/blogs");
 });
 



 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

app.listen(process.env.PORT || 4444,function() {
    console.log("server started");
})