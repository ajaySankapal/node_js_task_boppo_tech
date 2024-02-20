import { Project } from "../models/project.model.js"
import { SCHEMA_NAME_CONSTANT } from "../utils/constants.js"
import { generateId } from "../utils/generateIds.js"
import Joi from "joi"

const projectSchema = Joi.object({
    name: Joi.string().required(),
    startedOn: Joi.date().required()
})

export const createProject = async (req, res) => {
    try {
        const {
            name,
            startedOn
        } = req.body
        const validSchema = projectSchema.validate({
            name,
            startedOn
        })
        if (validSchema.error) {
            return res.status(400).json({
                success: false,
                message: 'Data is missing or invalid'
            })
        }

        const project = await Project.create({
            projectId: await generateId(SCHEMA_NAME_CONSTANT.project),
            name,
            startedOn
        })
        return res.status(201).json({
            success: true,
            project
        })
    } catch (error) {
        console.log('🔴 ERROR IN CREATE PROJECT')
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}