const { employeeModel } = require("../models/employee.model")

const addEmployee = async(req, res)=>{
    try {
        const employee = new employeeModel(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const getEmployee = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    try {
        const totalCount = await employeeModel.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        
        const employees = await employeeModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.json({ employees, totalPages, perPage: limit }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updataEmployee = async(req, res)=>{
    const { id } = req.params;
    const payload = req.body;
    try {
        const updatedemp = await employeeModel.findByIdAndUpdate({ _id: id }, payload);
        res.status(200).json({ message: "employee updated successfully", user: updatedemp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteEmployee = async(req, res)=>{
    const { id } = req.params;
    try {
        const deleteemp = await employeeModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const searchByName = async (req, res) => {
    const search = req.query.search;
    try {
        const employees = await employeeModel.find({ firstName: search });
        if (employees.length > 0) {
            res.status(200).json({ employees });
        } else {
            res.status(404).json({ msg: `No employees found with the name '${search}'` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const sortBySalary = async (req, res) => {
    const sortOrder = req.query.sortOrder || 'asc'; 
    try {
        let employees;
        if (sortOrder === 'asc') {
            employees = await employeeModel.find().sort({ salary: 1 });
        } else if (sortOrder === 'desc') {
            employees = await employeeModel.find().sort({ salary: -1 });
        } else {
            return res.status(400).json({ msg: 'Invalid sort order' });
        }
        
        if (employees.length > 0) {
            res.status(200).json({ employees });
        } else {
            res.status(404).json({ msg: 'No employees found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const filterByDepartment = async (req, res) => {
    const department = req.query.department;
    try {
        const employees = await employeeModel.find({ department });
        if (employees.length > 0) {
            res.status(200).json({ employees });
        } else {
            res.status(404).json({ msg: `No employees found in the '${department}' department` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports={
    addEmployee,
    getEmployee,
    updataEmployee,
    deleteEmployee,
    searchByName,
    sortBySalary,
    filterByDepartment
}

