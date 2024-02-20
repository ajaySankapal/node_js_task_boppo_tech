import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";
import { assignProjectToEmployee } from "../controllers/projectsEmployees.controller.js";

const router = Router()

router.post('/', createProject)
router.post('/assignProject', assignProjectToEmployee)

export default router