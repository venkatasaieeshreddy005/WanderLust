const User=require("../models/user");


module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newuser=new User({username,email});
        const regusr= await User.register(newuser,password);
        req.login(regusr,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust!");
        res.redirect("/listings");

        });
        

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLOgin=(req,res)=>{
    res.render("users/login.ejs");
};



module.exports.login=async  (req,res)=>{
    req.flash("success","Welcome Back To WanderLust!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User logedout successfully!");

    res.redirect("/listings");
    })
};

