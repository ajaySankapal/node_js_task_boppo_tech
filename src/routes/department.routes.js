import { Router } from "express";
import { createDepartment, getAverageAgeByDepartment } from "../controllers/department.controller.js";

const router = Router()

router.post('/', createDepartment)
router.get('/getAverageAgeByDepartments', getAverageAgeByDepartment)

export default router