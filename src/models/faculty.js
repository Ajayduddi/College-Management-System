import { Schema, model } from 'mongoose';

const facultySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        require: true
    },
    user_details: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    courses_taught: [{
        type: Schema.Types.ObjectId,
        ref: "courses"
    }],
},{timestamps: true});

export const Faculty = model('faculty', facultySchema);