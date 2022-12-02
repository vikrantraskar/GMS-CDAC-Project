const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const config = require('./config')
const utils = require('./utils/utils')

const app = express() //it gives all functions of express

app.use( express.json()) //to parse json data 

app.use(cors()) //

//common for all users
const userRouter = require('./routes/user/user')
app.use('/user', userRouter)

//all member routers
const memberRouter = require('./routes/member/member')
app.use('/member', memberRouter)

//all trainer router
const trainerRouter = require('./routes/trainer/trainer')
app.use('/trainer', trainerRouter)

//all admin routers
//1. manage Admin
const manageAdminRouter = require('./routes/admin/manageAdmin')
app.use('/admin', manageAdminRouter)
//2. manage Trainer
const manageTrainerRouter = require('./routes/admin/manageTrainer')
app.use('/admin', manageTrainerRouter)
//3. manage Member
const manageMemberRouter = require('./routes/admin/manageMember')
app.use('/admin', manageMemberRouter)
//4. admin Dashboard
const adminDashboardRouter = require('./routes/admin/adminDashboard')
app.use('/admin', adminDashboardRouter)
//5. manage Packages
const managePackagesRouter = require('./routes/admin/managePackage')
app.use('/admin', managePackagesRouter)
//6. manage Shifts
const manageShiftsRouter = require('./routes/admin/manageShifts')
app.use('/admin', manageShiftsRouter)


app.listen(5000, '0.0.0.0', () =>{
    console.log('server has started at 5000')
})