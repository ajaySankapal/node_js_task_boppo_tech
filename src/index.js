import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

import express from 'express'
import connectDb from './lib/db.js'

const app = express()
connectDb()

app.use(express.json())

app.get('/health', async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: '🟢 SERVER IS RUNNING SUCCESSFULLY!'
        })
    } catch (error) {
        console.log('ERROR:', error.message)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


//IMPORT ROUTES
import EmployeeRoutes from './routes/employee.routes.js'
import DepartmentRoutes from './routes/department.routes.js'
import ProjectRoutes from './routes/project.routes.js'
import uploadRoutes from './routes/upload.routes.js'

app.use('/api/employee', EmployeeRoutes)
app.use('/api/department', DepartmentRoutes)
app.use('/api/project', ProjectRoutes)
app.use('/api/uploads', uploadRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🟢 SERVER IS UP ON PORT: ${PORT}`)
})