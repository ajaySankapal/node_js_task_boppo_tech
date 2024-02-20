import { Department } from "../models/department.model.js"
import { Employee } from "../models/employees.model.js"
import { SCHEMA_NAME_CONSTANT } from "../utils/constants.js"
import { generateId } from "../utils/generateIds.js"
import Joi from "joi"

const departmentSchema = Joi.object({
    name: Joi.string().required()
})

export const createDepartment = async (req, res) => {
    try {
        const {
            name
        } = req.body

        const validSchema = departmentSchema.validate({ name })
        if (validSchema.error) {
            return res.status(400).json({
                success: false,
                message: 'Data is missing or invalid'
            })
        }
        const department = await Department.create({
            departmentId: await generateId(SCHEMA_NAME_CONSTANT.department),
            name
        })
        return res.status(201).json({
            success: true,
            department
        })
    } catch (error) {
        console.log('🔴 ERROR IN CREATE DEPARTMENT')
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAverageAgeByDepartment = async (req, res) => {
    try {
        const averageAgeByDepartment = await Department.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'departmentId',
                    foreignField: 'departmentId',
                    as: 'employees'
                }
            },
            {
                $unwind: '$employees'
            },
            {
                $group: {
                    _id: '$_id',
                    departmentName: { $first: '$name' },
                    departmentId: { $first: '$departmentId' },
                    avg_age: { $avg: '$employees.age' }
                }
            },
            {
                $project: {
                    _id: 0,
                    departmentId: '$departmentId',
                    departmentName: 1,
                    avg_age: 1
                }
            },

        ]);
        return res.status(200).json({
            success: true,
            averageAgeByDepartment
        })
    } catch (error) {
        console.log('🔴 ERROR IN GETTING AVERAGE AGE BY DEPARTMENT')
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

