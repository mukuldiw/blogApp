//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology: true });
// mongoose.connect("mongodb://localhost:27017/blogDB",{ useUnifiedTopology: true });
const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog",blogSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  pass: String,
  blog: blogSchema
});

const User = mongoose.model("User",userSchema);


var page_post = {
  title: "",
  content: ""
}


app.get("/",function(req,res){
  
  Blog.find({},function(err,blogs){
    res.render("home.ejs",{
      abc: homeStartingContent,
      posts: blogs
    });
  });
});



app.get("/contact",function(req,res){
  res.render("contact.ejs",{
    contact_content: contactContent
  });
});

app.get("/about",function(req,res){
    res.render("about.ejs",{
      about_content: aboutContent
    });
});


app.get("/post",function(req,res){
  res.render("post.ejs",{
    post_title: page_post.title,
    post_content: page_post.content
  })
});



app.get("/compose",function(req,res){
  res.render("compose.ejs");
});



app.get("/posts/:title",function(req,res){
  console.log(req.params.title);
  Blog.find({},function(err,docs)
  {
    docs.forEach(doc => {
      var str1 = _.lowerCase(doc.title);
      var str2 = _.lowerCase(req.params.title)
      if( str1 === str2 ){
        console.log("Match");
        page_post.title = doc.title;
        page_post.content = doc.content;
        res.redirect("/post");
  };
});
  });
});


app.post("/compose",function(req,res){
  var input_blog = {
    title: req.body.postTitle,
    content: req.body.postContent
  }
  const new_blog = new Blog({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  new_blog.save();
  posts.push(input_blog);
  // console.log(posts);
  res.redirect("/");
});


app.get("/signup",function(req,res){
  res.render("signup");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.post("/signup",function(req,res){
  if(req.body.user_password === req.body.confirm_password){
    const a = new User({
      name: req.body.user_name,
      email: req.body.user_email,
      pass: req.body.user_password
    });
    a.save();
  }
  res.redirect("/login");
});

app.post("/login",function(req,res){
  User.find({},function(err,docs){
    docs.forEach(function(doc){
      if(doc.email === req.body.login_email && doc.pass === req.body.login_password ){
        console.log("Login Allowed");
        res.redirect("/");
      }
    
    })
  })
  
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
