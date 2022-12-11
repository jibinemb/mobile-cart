var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')


const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function(req, res, next) {
  let user=req.session.user
  console.log(user);
  productHelpers.getAllProducts().then((products)=>{
   
    res.render('user/view-product',{  products,user })
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    
    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }  
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
  })

})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')

    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }
  })

})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res,next)=>{
   
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalValue = 0
  if(products.length > 0){
    totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/cart',{products,user:req.session.user._id,totalValue})
  }else{
    res.render('user/cart-empty',{user:req.session.user._id})
  }
   
   console.log(products);
 
})

router.get('/add-to-cart/:id',(req,res)=>{
  let data = req.params.id;
  console.log("data",data);
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/');
  })
})
module.exports = router;
