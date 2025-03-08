import { validationResult, matchedData, checkSchema, body } from 'express-validator';
import { Router } from 'express';
import { Users } from '../models/users.js';
import passport from 'passport';
import { users_validation } from '../utils/validation_schemas.js';
import { Types } from 'mongoose';
import { Roles } from '../models/roles.js';
import { comparePassword, generateHash, generateUserId } from '../utils/helper.js';
import jwt from 'jsonwebtoken';

const route = Router();
const auth = passport.authenticate('jwt', { session: false });

// login
route.post('/login', [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6, max: 255 }).withMessage('Password must be between 6 to 255 characters')
], async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ result: false, message: errors.array(), data: [] });
        }

        const data = matchedData(req);
        const user = await Users.findOne({ email: data.email });
        if (user.status === "Active") {
            if (comparePassword(req.body.password, user.password)) {
                const role = await Roles.findById(user.role);
                const token = "Bearer " + jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                res.status(200).send({ result: true, message: "Login successful", data: { token : token , email: user.email, name : user.name, role : role.name } });
            }
            else {
                res.status(400).send({ result: false, message: "Invalid password", data: [] });
            }
        }
        else {
            res.status(404).send({ result: false, message: "User not found | Not Active", data: [] });
        }
    } catch (error) {
        console.error("Error while login : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while login", data: error })
    }
});

// get users
route.get('/', auth, async (req, res) => {
    try {
        const { search,limit=10,page=1, sort = "Asscending" } = req.query;
        const query = {};
        let sort_id;
        if (sort === "Descending") {
            sort_id = -1;
        }
        else {
            sort_id = 1;
        }
        
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: regex },
                { email: regex },
                { number: regex },
                { status: regex },
                { user_id: regex }
            ];
        }

        const data = await Users.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetched successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Users: ", error);
        res.status(500).send({ result: false, message: "Internal server error while getting Users", data: error });
    }
});

// get user by id
route.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Users.findOne({ user_id: id });
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Users : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Users", data: error })
    }
});

// add users
route.post('/',auth, checkSchema(users_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    next();
}, async (req, res) => {
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const data = matchedData(req);
            if (!Types.ObjectId.isValid(data.created_by)) {
                return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
            }
            data.user_id = data.user_id ? data.user_id : generateUserId();
            data.password = await generateHash(data.password);
            const newUser = await Users.create(data);
            res.status(201).send({ result: true, message: "Users created successfully", data: newUser });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while creating Users : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Users", data: error })
    }
});

// update user
route.post('/:id', auth, checkSchema(users_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    next();
}, async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const data = matchedData(req);
            if (!Types.ObjectId.isValid(data.created_by)) {
                return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
            }
            const updated = await Users.findByIdAndUpdate(id, data);
            res.status(200).send({ result: true, message: "Users updated successfully", data: updated });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while updating Users : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Users", data: error })
    }
});

// delete users        
route.delete('/:id',auth, async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleted = await Users.findByIdAndDelete(id);
            res.status(200).send({ result: true, message: "Users deleted successfully", data: deleted });
        }
        else {
            res.status(403).send({ result: false, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while deleting Users : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Users", data: error })
    }
});

export default route;