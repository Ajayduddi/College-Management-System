import { Schema, model } from 'mongoose';

const batchschema = new Schema({
    name: {
        type: String,
        required: true,
        unique : true
    },
    students_list: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    department: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        required: true,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export const Batches = model('batchs', batchschema);