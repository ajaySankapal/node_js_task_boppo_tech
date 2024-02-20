import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    projectId: {
        type: String,
        index: true,
        auto: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Project name is required']
    },
    startedOn: {
        type: Date
    }
},
    {
        timestamps: true
    }
)

export const Project = mongoose.model('Project', projectSchema)