const mongoose = require("mongoose")

const expenseSchema = mongoose.Schema({    
    category: {type:String, required: true, trim: true},
    amount: {type:Number, trim: true, required: true},    
    remarks: {type: String, trim: true, required: true}
    
}, {timestamps:true})

let Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;