var express = require('express');
const { response } = require('../app');
var router = express.Router();
var userHelper=require("../helpers/user-helpers")
var productHelper=require("../helpers/product-helpers")
const verifyLogin=(req,res,next)=>{

  if(req.session.loggedIn)
  {
    next();
  }
  else
    res.redirect('/login')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
  
    res.render('index', { products, user,admin:false});
  
   }) 
  
});

router.get('/login', function(req, res) {
   
  
  if(req.session.loggedIn)
     res.redirect('/')
  else
  {
    res.render('user/login',{"loginError":req.session.loginError})
    //
       req.session.loginError=false;
  }
    

});

router.get('/signup', function(req, res, next) {

  res.render('user/signup')

});

router.post('/signup', function(req, res) {

    userHelper.doSignUp(req.body,(data)=>
    { 
         res.render('user/login')
    })
    
})

router.post('/login', function(req, res) {

      
        userHelper.doLogin(req.body).then((data)=>
        {  
           if(data.status)
           {
             req.session.loggedIn=true
             req.session.user=data.user
             res.redirect('/')
           }
           else{  
               
            req.session.loginError=true;
               res.redirect('/login')
           }
        })


})


router.get('/logout',function(req,res){

  req.session.destroy();
  res.redirect('/')
});

router.get('/cart',verifyLogin,async(req,res)=>{
   

   let product= await userHelper.getCartProducts(req.session.user._id)
   console.log(product)
   let user=req.session.user
   res.render('user/cart', {product,user})

});

router.get('/add-to-cart/:id',verifyLogin,function(req,res){


 userHelper.addToCart(req.params.id,req.session.user._id).then((data)=>
 {
     res.redirect('/#two')
 })




})

module.exports = router;
