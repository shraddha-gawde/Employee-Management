const express = require("express")
const cookieparser = require("cookie-parser")

const { register, login, logout } = require("../controller/user.controller")
const { authentication } = require("../middlewares/auth.middleware")

const { addEmployee, getEmployee, updataEmployee, deleteEmployee, searchByName, sortBySalary, filterByDepartment } = require("../controller/employess.controller")
const router = express.Router();
router.use(express.json())
router.use(cookieparser())



router.post("/users/signup", register)
router.post("/users/login", login)

// protected routes
router.use(authentication)


router.get("/users/logout", logout)
router.get("/dashboard", getEmployee)
router.post("/dashboard/addEmployye", addEmployee)
router.patch("/dashboard/update/:id", updataEmployee)
router.delete("/dashboard/delete/:id", deleteEmployee)
router.get("/dashboard/search", searchByName)
router.get("/dashboard/sort", sortBySalary)
router.get("/dashboard/filter", filterByDepartment)
module.exports={ 
    router 
}