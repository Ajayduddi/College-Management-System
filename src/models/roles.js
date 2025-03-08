import { Schema, model } from 'mongoose';

const rolesSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique : true
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

export const Roles = model('roles', rolesSchema);