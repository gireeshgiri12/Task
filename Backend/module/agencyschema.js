const mongoose = require("mongoose")
const schema= mongoose.Schema

const agencySchema = new schema({
    Name:{ type:String,required:true },
    Address1:{ type:String,required:true },
    Address2:{ type:String, required:false },
    State:{ type:String, required:true },       
    PhoneNumber: { type: String,required:true }
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" }  
})

 const AgencyDetails = mongoose.model("AgencyDetails",agencySchema)
 module.exports=AgencyDetails
    
