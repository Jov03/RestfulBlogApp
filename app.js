var express=require('express'),
    mongoose=require('mongoose'),
    methodOverride=require('method-override'),
    bodyParser=require('body-parser'),
    app=express();

mongoose.connect(process.env.CUSTOMCONNSTR_MyConnectionString||'mongodb://localhost/blogapp');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//Restful Routes
//GET ROUTES
app.get('/',function(req,res){
    res.redirect('/blogs');

});
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log('Error!!');
        }else{
            res.render('index',{blogs:blogs});
        }
    });
});
app.get('/blogs/new',function(req,res){
    res.render('new');
});
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/');
        }else{
            res.render('show',{blog:foundBlog});
        }

    })
});
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/');
        }else{
            res.render('edit',{blog:foundBlog});
        }
    })
});
//POST ROUTES
app.post('/blogs/new',function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render('/blogs/new');
        }else{
            console.log(newBlog);
            res.redirect('/');
        }
    });
});

//PUT ROUTES
app.put('/blogs/:id',function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,newBlog){
        if(err){
            res.redirect('/');  
        }else{
            res.redirect('/');
            
        }
    });
    
});

//DELETE ROUTES
app.delete('/blogs/:id',function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
        if(err){
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    })
});


app.listen(process.env.Port||8000,function(){
    console.log('Server has started');
});