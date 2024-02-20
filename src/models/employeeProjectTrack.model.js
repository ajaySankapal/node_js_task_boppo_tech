import mongoose, { Schema } from "mongoose";

const employeeProjectTrackSchema = new Schema({
    projectId: {
        type: String,
        index: true,
        auto: true,
        required: true,
    },
    employeeId: {
        type: String,
        index: true,
        auto: true,
        required: true
    },
    joined: {
        type: Date
    },
    exit: {
        type: Date
    }
},
    {
        timestamps: true
    }
)

export const EmployeeProjectTrack = mongoose.model('EmployeeProjectTrack', employeeProjectTrackSchema)