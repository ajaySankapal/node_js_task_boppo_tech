import { EmployeeProjectTrack } from "../models/employeeProjectTrack.model.js"
import { Employee } from "../models/employees.model.js"
import { Project } from "../models/project.model.js"

export const assignProjectToEmployee = async (req, res) => {
    try {
        const {
            projectId,
            employeeId,
            joined,
            exit
        } = req.body
        const project = await Project.findOne({
            projectId
        })
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            })
        }
        const employee = await Employee.findOne({
            employeeId
        })
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            })
        }
        const assignProject = await EmployeeProjectTrack.create({
            projectId,
            employeeId,
            joined,
            exit
        })
        return res.status(201).json({
            success: true,
            message: `Project: ${projectId} is assigned to Employee:${employeeId} successfully`
        })
    } catch (error) {
        console.log('🔴 ERROR IN ASSIGN PROJECT TO EMPLOYEE')
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}