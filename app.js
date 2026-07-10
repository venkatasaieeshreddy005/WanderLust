if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const session=require("express-session");
const { MongoClient } = require("mongodb");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const listingsroute=require("./routes/listing.js");
const reviewsroute=require("./routes/reviews.js");
const userrouter=require("./routes/user.js");


app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,'/public')))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));

const dburl=process.env.ATLAS_DB_URL;

main().then(()=>{
    console.log('connected to database wanderlust');
}).catch(err => console.log(err));

async function main() {
    // the database name is wanderlust
    
  await mongoose.connect(dburl);

}


const store= MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("ERROR INMONGO-SESSION STORE");
});

const sessionopt={
    store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  }
};
// app.get('/',(req,res)=>{
//     res.send('this is home page');

// });



app.use(session(sessionopt));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});




// app.get("/demouser",async (req,res)=>{
//     const fakeuser=new User({
//         email:"fake123@gmail.com",
//         username:"fake-1"
//     });

//     let reg1=await User.register(fakeuser,"fake-1");
//     res.send(reg1);
// });

app.use("/listings",listingsroute);
app.use("/listings/:id/reviews",reviewsroute);
app.use("/",userrouter);









app.use((req,res,next)=>{
    next(new ExpressError(404,'page notfound'));

});

app.use((err,req,res,next)=>{

    let {statusCode=401,message="Something is Wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

// Final Error Handling Middleware
app.use((err, req, res, next) => {
    // Extract statusCode and message with safe fallbacks
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    
    // Render your custom error page and pass the message to error.ejs
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080,()=>{
    console.log('server is listening at port 8080');
});






// app.get('/testlistings',async (req,res)=>{
//     let sam=new listing({
//         title:'my view',
//         description:'my view in the usa',
//         price:1200,
//         location:'california,usa',
//         country:'usa'
//     });
//    await sam.save();
//    res.send('successful testing');
// })