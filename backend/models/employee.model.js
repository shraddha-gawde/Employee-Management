const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    department: {
        type: String,
        enum: ['Tech', 'Marketing', 'Operations'],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    hireDate: {
        type: Date,
        default: Date.now 
    }
},{
    versionKey: false
});

const employeeModel = mongoose.model("Employee", employeeSchema);

module.exports = {
    employeeModel
};
