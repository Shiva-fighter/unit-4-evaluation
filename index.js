const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const connect = ()=>{
    return mongoose.connect("mongodb+srv://shiva:shiva_123@cluster0.1b3d6.mongodb.net/bank_detail?retryWrites=true&w=majority")
}

// -------------------user model----------------------------------------
const userSchema = new mongoose.Schema({
    first_name:{type:String, require:true},
    middle_name:{type:String, require:true},
    last_name:{type:String, require:true},
    age:{type:Number, require:true},
    email:{type:String, require:true},
    address:{type:String, require:true},
    gender:{type:String, require:false, default:"female"},
    type:{type:String, require:false, default:"customer"},
    master_id:{type:mongoose.Schema.Types.ObjectId, require:false,ref:"master"},
    saving_id:{type:mongoose.Schema.Types.ObjectId, require:true,ref:"saving"},
    fixed_id:{type:mongoose.Schema.Types.ObjectId, require:true,ref:"fixed"}

},
{
 timestamps:true
});

const User = mongoose.model("user", userSchema);

// ------------------------------------branch model--------------------------------------------------------------

const branchSchema = new mongoose.Schema({
    name:{type:String, require:true},
    address:{type:String, require:true},
    IFSC:{type:Number, require:true},
    MICR:{type:Number, require:true},
    master_id:{type:mongoose.Schema.Types.ObjectId, require:true,ref:"master"}
    
},
{
 timestamps:true
});

const Bank = mongoose.model("bank", branchSchema);

// ---------------------------------master acc. model-----------------------------------------------------------
const masterSchema = new mongoose.Schema({

    balance:{type:Number, require:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, require:true,ref:"user"}

},
{
 timestamps:true
});

const Master = mongoose.model("master", masterSchema);

// ----------------------------------saving account------------------------------------------------
const savingSchema = new mongoose.Schema({

    account_number :{type:Number, require:true, unique:true},
    balance:{type:Number, require:true},
    interestRate:{type:Number, require:true}
   

},
{
 timestamps:true
});

const Saving = mongoose.model("saving", savingSchema);

// ----------------------------fixed account model-----------------------------------------

const fixedSchema = new mongoose.Schema({

    acc_number :{type:Number, require:true, unique:true},
    balance:{type:Number, require:true},
    interestRate:{type:Number, require:true},
    startDate:{type:String, require:true},
    maturityDate:{type:String, require:true}

},
{
 timestamps:true
});

const Fixed = mongoose.model("fixed", fixedSchema);

// ---------------------------Relational Manager----------------------------------------------

const relManSchema = new mongoose.Schema({

relational_man:{type:mongoose.Schema.Types.ObjectId, require:true,ref:"user"}

},
{
 timestamps:true
});

const Relational = mongoose.model("relational", relManSchema);

app.post("/relational", async(req,res)=>{
    try{
        const relational = await Relational.create(req.body);
        return res.status(201).send(relational);
    }
    catch(err){
        console.error(err.message);
    }
})



app.post("/saving", async(req,res)=>{
    try{
        const saving = await Saving.create(req.body);
        return res.status(201).send(saving);
    }
    catch(err){
        console.error(err.message);
    }
})

app.post("/fixed", async(req,res)=>{
    try{
        const fixed = await Fixed.create(req.body);
        return res.status(201).send(fixed);
    }
    catch(err){
        console.error(err.message);
    }
})

app.delete("/fixed/:id", async(req,res)=>{
    try{
        const fixed = await Fixed.findByIdAndDelete(req.params.id);
        return res.status(200).send(fixed);
    }
    catch(err){
        console.log(err.message);
    }
})

app.get("/relational", async(req,res)=>{
    try{
        const relational = await Relational.find().lean().exec();
        return res.status(201).send(relational);
    }
    catch(err){
        console.error(err.message);
    }
});

app.post("/master", async(req,res)=>{
    try{
        const master = await Master.create(req.body);
        return res.status(201).send(master);
    }
    catch(err){
        console.error(err.message);

    }
})



app.post("/user", async(req,res)=>{
    try{
        const user = await User.create(req.body);
        return res.status(201).send(user);
    }catch(err){
        return res.status(500).send(err.message);
    }
});


app.get("/master/:id", async(req,res)=>{
    try{
const master = await Master.findById(req.params.id);
return res.status(201).send(master);

    }
    catch(err){
        return res.status(500).send(err.message);
    }
})

app.get("/user", async(req,res)=>{ 

    try{
        const user = await User.find().lean().exec();
        return res.status(201).send(user);
    }
    catch(err){
        return res.status(500).send(err.message);
    }
})
   
app.listen(8001, async(req,res)=>{
    try{
        await connect();
        console.log("listenin port 8001");
    }
    catch(err){
        console.error(err.message);
    }
  
});