import { validationResult, matchedData, checkSchema } from 'express-validator';
import { Departments } from '../models/departments.js';
import { Router } from 'express';
import passport from 'passport';
import { department_validation } from '../utils/validation_schemas.js';
import { Types } from 'mongoose';
import { generateDeptId } from '../utils/helper.js';
import { Roles } from '../models/roles.js';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get departments
route.get('/', async (req, res) => {
    try {
        const data = await Departments.find();
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Departments : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Departments", data: error })
    }
});

// add departments
route.post('/', checkSchema(department_validation), (req, res, next) => {
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
            data.dept_id = generateDeptId();
            const newDept = await Departments.create(data);
            res.status(201).send({ result: true, message: "Departments created successfully", data: newDept });
        }
        else {
            res.status(403).send({ result: true, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while creating Departments : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Departments", data: error })
    }
});

// update departments
route.post('/:id', checkSchema(department_validation), (req, res, next) => {
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
            const updated = await Departments.findByIdAndUpdate(id, data);
            res.status(200).send({ result: true, message: "Departments updated successfully", data: updated });
        }
        else {
            res.status(403).send({ result: true, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while updating Departments : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Departments", data: error })
    }
});

// delete departments
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const role = await Roles.findOne({ name: "Admin" });
        if (req.user.role.equals(role._id)) {
            const deleted = await Departments.findByIdAndDelete(id);
            res.status(200).send({ result: true, message: "Departments deleted successfully", data: deleted });
        }
        else {
            res.status(403).send({ result: true, message: "You desn't have a permission to do this operation", data: [] });
        }
    } catch (error) {
        console.error("Error while deleting Departments : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Departments", data: error })
    }
});

export default route;