import { Router } from "express";
import { deleteEmployee, getEmployeeByCurrentProject, getEmployeeByProjectId, listEmployeeByDepartment, listEmployees, registerEmployee } from "../controllers/employee.controller.js";

const router = Router()

router.post('/', registerEmployee)
router.get('/list', listEmployees)
router.get('/employeesByDepartment/:departmentId', listEmployeeByDepartment)
router.get('/employeesByCurrentProject/:projectId', getEmployeeByCurrentProject)
router.get('/employeesByProject/:projectId', getEmployeeByProjectId)

router.delete('/delete/:employeeId', deleteEmployee)

export default router