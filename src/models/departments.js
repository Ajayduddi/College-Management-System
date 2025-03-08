import { Schema, model } from 'mongoose';

const departmentSchema = new Schema({
    dept_id: {
        type: String,
        require: true,
        unique : true
    },
    name: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        default : "Active"
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export const Departments = model('departments', departmentSchema);