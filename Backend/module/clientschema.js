const AgencyDetails = require('../module/agencyschema')
const { Types , Schema } = require('mongoose')
const mongoose = require("mongoose")

const clientSchema = new Schema({
    clientName:{ type:String,required:true },
    clientEmail:{ type:String,required:true },
    clientPhoneNumber: { type: String,required:true },
    TotalBill:{ type:Number, required:true },
    AgencyId:{ type:Schema.Types.ObjectId, validate: Types.ObjectId.isValid, ref: AgencyDetails, required:true }     
  
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" }  
})

 const clientDetails = mongoose.model("clientDetails",clientSchema)
 module.exports=clientDetails

