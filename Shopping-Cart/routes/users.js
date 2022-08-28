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
router.get('/', async function(req, res, next) {
  
  let user=req.session.user
  let cartCount=null
  if(user)
  {
    cartCount= await userHelper.getCartCount(req.session.user._id)
  }
      
  productHelper.getAllProducts().then((products)=>{
  
    res.render('index', { products, user,admin:false,cartCount});
  
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
   
   
   let products= await userHelper.getCartProducts(req.session.user._id)
   let user=req.session.user
   let cartCount=null
   let value=0;
   for(var i=0;i<products.length;i++)
   {
       for(var j=0;j<products[i].product.length;j++)
       {
            value+=parseInt((products[i].product[j].price)*(products[i].quantity))
       }
   }
   console.log(value)
  if(user)
  {
    cartCount= await userHelper.getCartCount(req.session.user._id)
  }
   res.render('user/cart', {products,user,cartCount,value})

});

router.get('/add-to-cart/:id',verifyLogin,function(req,res){

 userHelper.addToCart(req.params.id,req.session.user._id).then((data)=>
 {
     //res.redirect('/#two')
     res.json({status:true})
 })




});

router.get('/remove-product/search',function(req,res){
  
  console.log(req.query.id)
 console.log(req.query.proId)

 userHelper.deleteItem(req.query.id,req.query.proId).then(()=>
 {
      res.redirect('/cart')
 })

})

module.exports = router;
