import { Department } from "../models/department.model.js"
import { Employee } from "../models/employees.model.js"
import { Project } from "../models/project.model.js"
import { SCHEMA_NAME_CONSTANT } from "./constants.js"


export const generateId = async function (prefix) {
    try {
        if (prefix === SCHEMA_NAME_CONSTANT.project) {
            const project = await Project.find({}).sort({ createdAt: -1 })

            let counter = project[0]?.projectId.match(/\d+/g);
            counter = counter ? +counter + 1 : 1;

            const paddedId = String(counter).padStart(3, '0')
            const projectId = `PROJ${paddedId}`
            return projectId

        } else if (prefix === SCHEMA_NAME_CONSTANT.department) {
            const department = await Department.find({}).sort({ createdAt: -1 })

            let counter = department[0]?.departmentId?.match(/\d+/g);
            counter = counter ? +counter + 1 : 1;

            const paddedId = String(counter).padStart(3, '0')
            const departmentId = `DEPT${paddedId}`
            return departmentId

        } else {
            const employees = await Employee.find({}).sort({ createdAt: -1 })

            let counter = employees[0]?.employeeId?.match(/\d+/g);
            counter = counter ? +counter + 1 : 1;

            const paddedId = String(counter).padStart(3, '0')
            const employeeId = `EMP${paddedId}`
            return employeeId
        }
    } catch (error) {
        console.log('🔴 ERROR IN GENERATE EMPLOYEE ID', error)

    }
}