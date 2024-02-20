import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    departmentId: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Department name is required']
    }
},
    {
        timestamps: true
    }
)

export const Department = mongoose.model('Department', departmentSchema)