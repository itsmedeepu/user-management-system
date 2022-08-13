require('dotenv').config();


require("ejs");

const bcrypt =require("bcryptjs");

const express=require("express");
const app=express();
const port =process.env.port || 5050



//database connection
require("./db/conn");

//require mongoose schema
const User=require("./models/usermodel");

app.use(express.json());


app.use(express.urlencoded({extended:false}));

//set view engine

app.set("view engine","ejs");

app.get("/",async (req,res)=>{

   const userfetch= await User.find({})
res.status(201).send("Hi server running ");
console.log(userfetch);

})


app.get("/register",(req,res)=>{

    res.render("index",{success:""})
})
app.get("/login",(req,res)=>{

    res.render("login",{success:"",error:""})
})

//for user registration  request 

app.post("/register",async (req,res)=>{

    
    try {

    const data =req.body;


   const finduser= await User.findOne({email:data.email});

   if(finduser){

    console.log(`user already registred with same mail`);
    res.status(404).send("Duplicate Email Id not allowed ");
   }
   else{


    const Usersave= new User(data);
    //bycrypt hash password

    Usersave.password = await bcrypt.hash(Usersave.password, 10);

    await Usersave.save();

    console.log("user saved to database ");
    res.render("index",{success:"user added sucessfully"})

   }

    }

    catch(err){

        console.log(err);
        res.send(err);
    }
})

//create login request
app.post("/login",async (req,res)=>{
try {

   // const validatepassword=bcrypt.compare()
   const userverify =User.findOne({email:req.body.email});
   const validatepassword= await bcrypt.compare(req.body.password,userverify.password)
   if(validatepassword){

    // res.status(201).send("user with details found");
    res.render("login",{success:"login success",error:""})


   }

   else{

    console.log("wrong user details   ");
    res.render("login",{error:"login failed",success:""})
    


   }
}catch(err){

    console.log(`something went bad at server please try after some time `);

    res.status(404).send(`something went bad at server side kindly look after some time `);
}



})
//update user details
app.put("/update/:id",async(req,res)=>{
    const userid=req.params.id
    const updatedata=req.body
    //find user exist in databse and update accordingly
    try{
    const userfind= await User.findByIdAndUpdate(userid,updatedata,{new:true});
    if(userfind){


        console.log(`user updated successfully`);

        res.status(201).send("user updated");
    }
    else{

        console.log(`user not updated `);

        res.status(404).send("user not updated");

    }
}
catch(err){
    console.log("!!Ooops something went bad at server",err);

    res.status(404).send("!!Ooops something went bad at server");
}
})
//delete user 
app.get("/delete/:id",async(req,res)=>{
    const userid=req.params.id
    //find user exist in database and update accordingly
    try{
    const userfinddele= await User.findByIdAndRemove(userid);
    if(userfinddele){


        console.log(`user deleted successfully`);

        res.status(201).send("user deleted successfully ");


    }
    else{

        console.log(`user not deleted  `);
        res.status(404).send("user not deleted ");

    }

}
catch(err){


    console.log("!!Ooops something went bad at server",err);

    res.status(404).send("!!Ooops something went bad at server");

}

})



app.listen(port,()=>{

    console.log(`server running at http://localhost:${port}`)
})