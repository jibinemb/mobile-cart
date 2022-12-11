var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-product',{ admin:true, products })
  })
 
  
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
  console.log('ADMIN ADDED');
})

router.post('/add-product',(req,res)=>{
  
  
 

productHelper.addproduct(req.body,(id)=>{
  let image = req.files.Image
  console.log(id)

  image.mv('./public/product-images/'+id+'.jpg',(err)=>{
    if(!err){
      res.render('admin/add-product',{admin:true})
    }else{
      console.log(err);
    }
  })
 
})

})

module.exports = router;
