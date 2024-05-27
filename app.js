const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');     //ejs-Mate     FOR BOILERPLATE
const wrapAsync=require("./utils/wrapAsync.js");  // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const ExpressError=require("./utils/ExpressError.js");  // CREATING USEREFINED ERROR CLASS
const validateSchema=require('./validateSchema/validateSchema.js');

app.engine("ejs",ejsMate);             //ejs-Mate
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log('DATABASE CONNECTED');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080,()=>{
    console.log("Server Online");
})

app.get("/",(req,res)=>{
    res.send('hello');
})

// VALIDATION FUNCTION USING Joi

function validateListing(req,res,next){
    const result=validateSchema.validate(req.body);
    console.log(req.body);
    if(result.error){
        let errMsg=result.error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

app.get("/testlisting",async (req,res)=>{
    let samplelisting=new Listing({
        title:"My new Villa",
        description:"By the brach",
        price:1500,
        location:"Goa",
        country:"India"
    })
    await samplelisting.save();
        console.log("listing saved");
        res.send("Success");
})

//  INDEX ROUTE

app.get("/listings",wrapAsync(async (req,res)=>{     
    const allListings=await Listing.find();
    res.render('./listings/index.ejs',{allListings});
}));

// CREATE ROUTE

app.get("/listings/new",(req,res)=>{                   
    res.render('./listings/new.ejs');
})

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{   // validateListing is a middleware function for validation
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

// UPDATE ROUTE

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{                       
    let {id}=req.params;
    const data=await Listing.findById(id);
    res.render("listings/edit.ejs",{data});
}));

app.put("/listings/:id",wrapAsync(async (req,res)=>{                           
    let {id}=req.params;
    let data=await Listing.findByIdAndUpdate(id,{...req.body.listing})  // de constructing the object   
    res.redirect(`/listings/${id}`);
}));

// SHOW ROUTE

app.get("/listings/:id",wrapAsync(async (req,res)=>{                  
    let {id}=req.params; 
    const data=await Listing.findById(id);
    res.render('./listings/show.ejs',{data});
}))

// DELETE ROUTE

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// CODE FOR PAGE NOT FOUND

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

// ERROR HANDLING MIDDLEWARE

app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong!"}=err;
   // ExpressError(statusCode,errorMssage);
    // res.status(status).send(message);
    res.render("listings/error.ejs",{message});
})