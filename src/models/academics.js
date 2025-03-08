import { Schema, model } from 'mongoose';

const schema = new Schema({
    regulation: {
        type: String,
        require: true,
        unique: true,
        minlength: 3,
        maxlength: 3
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        require: true
    },
    semister: [{
        semister_id: {
            type: String,
            required: true
        },
        course: [{
            type: Schema.Types.ObjectId,
            ref: "courses"
        }],
        syllabus: {
            type: String,
            required: true
        }
    }],
    syllabus: {
        type: String,
        require : true
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

export const Academics = model('academics', schema);