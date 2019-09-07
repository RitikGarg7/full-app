var express=require('express');
var app=express();

app.set("view engine",".ejs");
app.use(express.static("public"));

app.get("/",function(req,res) {
    res.render("index.ejs");
})


app.listen(process.env.PORT || 4444,function() {
    console.log("server started");
})