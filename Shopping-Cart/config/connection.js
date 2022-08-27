const mongoClient=require('mongodb').MongoClient
//state of database
const state={
    db:null
}
//to connect database
module.exports.connect = function(callback)
{
    const url='mongodb://localhost:27017'
    const dbname='shopping'

    mongoClient.connect(url,(err,data)=>{

        if(err) return callback(err)
        state.db=data.db(dbname)
       //or callback()
    })

    callback()
}

//to get database

module.exports.get=function(){

    return state.db;
}