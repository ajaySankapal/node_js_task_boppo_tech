import mongoose, { Schema } from "mongoose";

const employeesSchema = new Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    departmentId: {
        type: String,
        required: [true, 'DepartmentId is required']
    },
    onBoardDate: {
        type: Date,
        required: [true, 'Onboard date is required']
    },
    age: {
        type: Number
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

},
    {
        timestamps: true
    }
)

export const Employee = mongoose.model('Employee', employeesSchema)