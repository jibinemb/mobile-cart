var db=require('../configuration/connection')
var collections=require('../configuration/collection')
var objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const collection = require('../configuration/collection')
const { response } = require('express')
module.exports={
    doSignup:(userData)=>{

        return new Promise(async(resolve, reject) => {
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])    
            })
           
            
        })
        
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('Login Success');
                        response.user = user
                        response.status = true
                        resolve(response)
                       
                    }else{
                        console.log('Login Failed');
                        resolve({status: false})
                       
                    }
                })
            }else{
                console.log('login failed');
                resolve({status: false})
            }
     
        })

    },
    addToCart:(proId,userId)=>{
        let proObj = {
            item:objectId(proId),
            quantity:1
        }
        console.log("proObj",proObj);
        console.log("proId",proId,"userId",userId);
        return new Promise(async (resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist = userCart.products.findIndex(product=> product.item == proId)
                console.log(proExist);
                if(proExist != -1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId),'products.item' : objectId(proId)},
                    {
                        $inc : {'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},{
                    
                        $push:{products:proObj}
                    
                }).then((response)=>{
                    //resolve()
                })
            }
            }else{
                let cartObj = {
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
}