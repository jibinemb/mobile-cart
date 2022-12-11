var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{ admin:true, products })
  })
 
  
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
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

// router.get('/delete-product/:id',(req,res)=>{
//   let proId = req.params.id
//   console.log(proId)
//   productHelpers.deleteProduct(proId).then((response)=>{
//     res.redirect('/admin/')
//   })
// })
router.get('/delete-product/',(req,res)=>{
  let proId = req.query.id
  console.log("proId",proId);
  console.log("req.id",req.query.name);
})

router.get('/edit-product/:id',async (req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{admin:true,product})
})

})

module.exports = router;
