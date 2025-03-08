import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    user_id: {
        type: String,
        require: true,
        unique : true
    },
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength : 120
    },
    email: {
        type: String,
        require: true,
        unique : true,
        match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
    },
    phone_no: {
        type: Number,
        require: true,
        length : 10
    },
    password: {
        type: String,
        require: true,
    },
    dob: {
        type: Date,
        require :true  
    },
    dept: {
        type: Schema.Types.ObjectId,
        ref: "departments",
        require : true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "roles",
        require : true
    },
    status: {
        type: String,
        default: "Active",
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Users = model('users', userSchema);