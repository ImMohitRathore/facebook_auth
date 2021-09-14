const express = require("express");
const passport = require("passport");
const facebookStratergy = require("passport-facebook").Strategy
const session = require("express-session")
const app = express()
// const cors= require("cors")

// app.use(cors())



const User = require("./model/UserSchma")
app.use(passport.initialize());
app.use(passport.session())




app.use(session({secret :"thisisnotforyou"}))

passport.use( new facebookStratergy({
    clientID : "857948888191594",
    clientSecret : "407deeaab3734fc3089e7cd7913f96fd",
    callbackURL:"http://localhost:5000/facebook/callback",
    profileFields :[ 'id' , 'displayName' , 'name' , 'gender', 'picture.type(large)',"email" ]

},
 function(token  , refreshToken , profile , done){
 
    process.nextTick(function() {

        
        User.findOne({ 'uid' : profile.id }, function(err, user) {

            if (err)
                return done(err);

           
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); 
            } else {
             
                var newUser  = new User();

          
                newUser.uid   = profile.id;           
                         
                newUser.name = profile.name.givenName + ' ' + profile.name.familyName; 
                newUser.email= profile.emails[0].value; 
        
                newUser.pic = profile.photos[0].value
             
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    })

}));
 

passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, cb) {
   User.findOne(id,function(err ,user){
       done(err , user)
   })
  })



app.get('/auth/facebook',passport.authenticate('facebook',{
    scope:"email"
}))

app.get("/facebook/callback",passport.authenticate('facebook',{
    successRedirect:"/profile" ,
    failureRedirect:"/failed"
}))


app.get("/profile",(req ,res)=>{
res.status(200).send("you are valid user")
})

app.get("/failed",(req ,res)=>{
    res.send("you not a valid user")
    })



app.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
  });
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }

app.get("/user",(req ,res)=>{
console.log("getting the data")
res.send(user)
})
PORT =  process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`server is listening on ${PORT}`);
})