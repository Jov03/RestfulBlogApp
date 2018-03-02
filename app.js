var express=require('express'),
    mongoose=require('mongoose'),
    methodOverride=require('method-override'),
    path=require('path'),
    bodyParser=require('body-parser'),
    env = require('dotenv/config'),
    app=express();


mongoose.connect('mongodb://'+process.env.COSMOSDB_USERNAME+'.documents.azure.com:10255/jovblog?ssl=true', {
    auth: {
        user: process.env.COSMOSDB_USERNAME,
        password: process.env.COSMOSDB_PASSWORD
    }
    })
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.set('views', path.join(__dirname, 'views'));
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


app.listen(8008,function(){
    console.log('Server has started');
});