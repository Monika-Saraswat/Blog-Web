const mongoose =require('mongoose')

const dbConnect=async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        console.log('mongodb is connected')
    }catch(error){
        console.log('mongodb connection error',error)
    }
}
module.exports= dbConnect