const mongoose = require("mongoose");

const DB = "mongodb+srv://Mohit:2Ql7JGwQBuL3JNxg@cluster0.yw4ld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(DB).then(()=>{
    console.log("connected");
}).catch((e)=>{
console.log(e);
})

var userSchema = mongoose.Schema({
    uid: String,
    
    email: String,
    name: String,
   
    pic: String
});

module.exports = mongoose.model('User', userSchema);