import { Department } from "../models/department.model.js"
import { EmployeeProjectTrack } from "../models/employeeProjectTrack.model.js"
import { Employee } from "../models/employees.model.js"
import { Project } from "../models/project.model.js"
import { SCHEMA_NAME_CONSTANT } from "../utils/constants.js"
import { generateId } from "../utils/generateIds.js"
import Joi from "joi"

const employeeSchema = Joi.object({
    firstName: Joi
        .string()
        .min(3)
        .max(30)
        .required(),
    lastName: Joi
        .string()
        .min(3)
        .max(30)
        .required(),
    departmentId: Joi
        .string()
        .required(),
    onBoardDate: Joi
        .date()
        .required(),
    age: Joi.number()
})
export const registerEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            departmentId,
            onBoardDate,
            age
        } = req.body

        const validSchema = employeeSchema.validate({
            firstName,
            lastName,
            departmentId,
            onBoardDate,
            age
        })
        if (validSchema.error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Fields are missing or invalid.'
                })
        }

        const department = await Department.findOne({ departmentId })

        if (!department) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: 'Department is not found'
                })
        }



        const employee = await Employee.create({
            employeeId: await generateId(SCHEMA_NAME_CONSTANT.employee),
            firstName,
            lastName,
            departmentId,
            onBoardDate,
            age
        })
        return res
            .status(201)
            .json({
                success: true,
                employee
            })

    } catch (error) {
        console.log('🔴 ERROR IN REGISTER EMPLOYEE')
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const listEmployees = async (req, res) => {
    try {
        let searchQuery = {};
        searchQuery.status = { $ne: 'inactive' }
        if (req.query.searchKey) {
            searchQuery.$or = [
                {
                    firstName:
                        { $regex: req.query.searchKey, $options: 'i' }
                },
                {
                    lastName:
                        { $regex: req.query.searchKey, $options: 'i' }
                },
                {
                    employeeId:
                        { $regex: req.query.searchKey, $options: 'i' }
                },
                {
                    'department.name':
                        { $regex: req.query.searchKey, $options: 'i' }
                },
                {
                    'currentlyWorkingProject.name':
                        { $regex: req.query.searchKey, $options: 'i' }
                }
            ];
        }
        const employees = await Employee.aggregate([

            {
                $lookup: {
                    from: 'employeeprojecttracks',
                    localField: 'employeeId',
                    foreignField: 'employeeId',
                    as: 'assignedProjects'
                },

            },
            {
                $unwind: {
                    path: '$assignedProjects',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: 'departmentId',
                    as: 'department'
                }
            },

            {
                $lookup: {
                    from: 'projects',
                    localField: 'assignedProjects.projectId',
                    foreignField: 'projectId',
                    as: 'currentlyWorkingProject'
                }
            },
            { $match: searchQuery },
            {
                $group: {
                    _id: '$employeeId',
                    employee: { $first: '$$ROOT' },
                    projects: { $push: '$currentlyWorkingProject' }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: '$employee.employeeId',
                    status: '$employee.status',
                    employeeName: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] },
                    departmentId: { $arrayElemAt: ['$employee.department.departmentId', 0] },
                    departmentName: {
                        $arrayElemAt: ['$employee.department.name', 0]
                    },
                    currentlyWorkingProject: {
                        $cond: {
                            if: { $eq: [{ $type: '$employee.currentlyWorkingProject' }, 'array'] },
                            then: {
                                projectId: { $arrayElemAt: ['$employee.currentlyWorkingProject.projectId', 0] },
                                projectName: { $arrayElemAt: ['$employee.currentlyWorkingProject.name', 0] },

                            },
                            else: null
                        }
                    }
                }
            }

        ])
        return res.status(200).json({
            success: true,
            employees
        })
    } catch (error) {
        console.log('🔴 ERROR IN LIST EMPLOYEES', error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const listEmployeeByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params
        const department = await Department.findOne({
            departmentId
        })
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            })
        }
        const employees = await Employee.aggregate([
            {
                $match: {
                    departmentId: departmentId,
                    status: { $ne: 'inactive' }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: 'departmentId',
                    as: 'department'
                }
            },
            {
                $project: {
                    _id: 0,
                    departmentId:
                        { $arrayElemAt: ['$department.departmentId', 0] },

                    departmentName:
                        { $arrayElemAt: ["$department.name", 0] },
                    employeeId: 1,

                    employeeName: { $concat: ['$firstName', ' ', '$lastName'] }
                }
            }

        ])

        return res.status(200).json({
            success: true,
            employees
        })
    } catch (error) {
        console.log('🔴 ERROR IN LIST EMPLOYEES', error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getEmployeeByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params
        const employees = await EmployeeProjectTrack.aggregate([
            {
                $match: {
                    projectId: projectId,
                    status: { $ne: 'inactive' }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: 'employeeId',
                    as: 'employee'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeId: { $arrayElemAt: ['$employee.employeeId', 0] },

                    employeeName: {
                        $concat: [
                            { $arrayElemAt: ['$employee.firstName', 0] },
                            ' ',
                            { $arrayElemAt: ['$employee.lastName', 0] }
                        ]
                    },
                    projectId: { $arrayElemAt: ['$project.projectId', 0] },

                    projectName:
                        { $arrayElemAt: ['$project.name', 0] },
                    WorkingFrom: { $arrayElemAt: ['$project.startedOn', 0] },

                }
            }

        ])

        return res.status(200).json({
            success: true,
            employees
        })
    } catch (error) {
        console.log('🔴 ERROR IN LIST EMPLOYEES', error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getEmployeeByCurrentProject = async (req, res) => {
    try {
        const currentDate = new Date();
        let searchQuery = {};
        const { projectId } = req.params

        searchQuery.projectId = projectId
        const project = await Project.findOne({
            projectId
        })
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            })
        }
        if (req.query?.startDate || req.query?.endDate) {
            const startDate = new Date(req.query?.startDate);
            const endDate = new Date(req.query?.endDate);
            searchQuery.$and = [
                { joined: { $gte: new Date(startDate) } },
                { exit: { $lte: new Date(endDate) } }
            ]
        } else {
            searchQuery.$or = [
                { exit: null },
                { exit: { $gt: currentDate } }
            ]
        }
        const employees = await EmployeeProjectTrack.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: 'employeeId',
                    as: 'employee'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            {
                $project: {
                    _id: 0,
                    exit: 1,
                    employeeId: { $arrayElemAt: ['$employee.employeeId', 0] },

                    employeeName: {
                        $concat: [
                            { $arrayElemAt: ['$employee.firstName', 0] },
                            ' ',
                            { $arrayElemAt: ['$employee.lastName', 0] }
                        ]
                    },
                    projectId: { $arrayElemAt: ['$project.projectId', 0] },

                    projectName:
                        { $arrayElemAt: ['$project.name', 0] },
                    WorkingFrom: '$joined',

                }
            }

        ])

        return res.status(200).json({
            success: true,
            employees
        })
    } catch (error) {
        console.log('🔴 ERROR IN LIST EMPLOYEES', error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params
        console.log(employeeId)
        const employee = await Employee.findOne({ employeeId })
        if (!employee) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Employee Not found'
                })
        }
        const deleteEmployee = await Employee.updateOne({ employeeId }
            ,
            { $set: { status: 'inactive' } },
        )
        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        })
    } catch (error) {
        console.log('🔴 ERROR IN DELETE EMPLOYEE', error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}