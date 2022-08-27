var db=require('../config/connection')
//const bcrypt=require('bcrypt')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId



module.exports={


doSignUp: (userData,callback)=>{

        db.get().collection(collection.USER).insertOne(userData).then((data)=>
        {   
            callback(data)
        }
     )
    

},

doLogin:(userData)=>{

   return new Promise(async(resolve,reject)=>{
    
    let loginStatus=false;
    let response={};
    let user= await db.get().collection(collection.USER).findOne({email:userData.email})
    if(user)
    {
          if(userData.password==user.password)
          {
              response.user=user;
              response.status=true;
              resolve(response)

          }
          else{

              resolve({status:false})
          }

    }

    else{

        resolve({status:false})
    }



   })

},


addToCart:(proId,userId)=>{

   return new Promise(async(resolve,reject)=>{

         let userCart=await db.get().collection(collection.CART).findOne({user:objectId(userId)})
         
         if(userCart)
         {
              db.get().collection(collection.CART).updateOne({user:objectId(userId)},
              
              {

                    $push:{products:objectId(proId)}
                 
              }
              
              
              ) .then((data)=>{
                
                console.log(data)
                resolve();
              })   
         }
         else{

            let cartObj={

                user:objectId(userId),
                products:[objectId(proId)]
            }
            db.get().collection(collection.CART).insertOne(cartObj).then((data)=>
            {
                 console.log(data);
                resolve(data);
            })
            
         }
   })

},

getCartProducts:(userId)=>{
    

    
    return new Promise(async(resolve,reject)=>{


        let userCart=await db.get().collection(collection.CART).findOne({user:objectId(userId)})
        if(userCart)

        { db.get().collection(collection.CART).aggregate([

             {
                $match:{user:objectId(userId)}
             },
             {

                $lookup:{
                    from:'product',
                    let:{proList:'$products'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $in:['$_id',"$$proList"]
                                }
                            }
                        }
                    ],

                    as:'cartItems'

                }
             }


         ]).toArray().then((data)=>{

            resolve(data[0].cartItems)
         })
    }

    else{
        resolve('No cart')
    }

    })


}





}