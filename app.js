var express= require("express");
var app= express();
var methodOverride= require("method-override");
app.use(methodOverride("_method"));//FOR USING DELETE AND PUT VERBS 
app.set("view engine", "ejs");
app.use(express.static("public"));
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var mongoose= require("mongoose");
var expressSanitizer=require("express-sanitizer");
app.use(expressSanitizer())
var url=process.env.DATABASEURL || "mongodb://localhost:27017/blogspost"
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//BLOG SCHEMA
var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type :Date, default: Date.now}
}); 
var Blog= mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Dogs blog",
// 	image:"https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body:"AND THIS IS A BLOGPPOST"
	
// });
// app.get("/", function(req,res){
// 	res.render("/blogs");
// })

app.get("/", function(req,res){
	res.redirect("/blogs");
})
//INDEX ROUTE
app.get("/blogs", function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err)
		}else{
			res.render("index", {blogs:blogs});
		}
						   
	 });
})
//NEW ROUTE
app.get("/blogs/new", function(req,res){
	res.render("new")
});
//CREATE ROUTE
app.post("/blogs", function(req,res){
	//CREATE BLOGPPOST
	// requesting the blog.body of new.ejs
	req.body.blog.body= req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	})
	
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			console.log("err");
			res.redirect("/blogs");
			
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	})
});
//EDIT ROTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			console.log("err");
			res.redirect("/blogs");
			
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
})
	});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs/" +req.params.id);
		}
	})
});
app.delete("/blogs/:id",function(req,res){
	//DESTROPY BLOGPPOST
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		
		}
		else{//DESTROY
			res.redirect("/blogs");
		}
	})
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
