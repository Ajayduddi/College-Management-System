import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
    course_id: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true,
        unique: true,
    },
    details: {
        type: Schema.Types.String
    },
    credits: {
        type: Number,
        require: true,
    },
    syllabus: {
        type: Schema.Types.String
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

export const Courses = model('courses', courseSchema);