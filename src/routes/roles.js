import { validationResult, matchedData, checkSchema } from 'express-validator';
import { Router } from 'express';
import { Roles } from '../models/roles.js';
import passport from 'passport';
import { roles_validation } from '../utils/validation_schemas.js';
import { Types } from 'mongoose';

const route = Router();
route.use(passport.authenticate('jwt', { session: false }));

// get roles
route.get('/', async (req, res) => {
    try {
        const { search, limit=10, page=1, sort = "Asscending" } = req.query;
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
                { status: regex },
            ];
        } 

        const data = await Roles.find(query).sort({ created_at: sort_id }).skip((page - 1) * limit).limit(limit);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Roles", data: error })
    }
});

// get role by id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const data = await Roles.findById(id);
        res.status(200).send({ result: true, message: "Data fetch successfully", data: data });
    } catch (error) {
        console.error("Error while fetching Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while getting Roles", data: error })
    }
});

// add roles
route.post('/', checkSchema(roles_validation), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ result: false, message: "Invalid data", data: result.array() });
    }
    next();
}, async (req, res) => {
    try {
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        const newRole = await Roles.create(data);
        res.status(201).send({ result: true, message: "Roles created successfully", data: newRole });
    } catch (error) {
        console.error("Error while creating Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while creating Roles", data: error })
    }
});

// update roles
route.post('/:id', checkSchema(roles_validation), (req, res, next) => {
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
        const data = matchedData(req);
        if (!Types.ObjectId.isValid(data.created_by)) {
            return res.status(400).send({ result: false, message: "Invalid created_by id", data: [] });
        }
        const updated = await Roles.findByIdAndUpdate(id, data);
        res.status(200).send({ result: true, message: "Roles updated successfully", data: updated });
    } catch (error) {
        console.error("Error while updating Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while updating Roles", data: error })
    }
});

// delete roles
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ result: false, message: "Invalid id", data: null });
    }
    try {
        const deleted = await Roles.findByIdAndDelete(id);
        res.status(200).send({ result: true, message: "Roles deleted successfully", data: deleted });
    } catch (error) {
        console.error("Error while deleting Roles : ", error);
        res.status(500).send({ result: false, message: "Internal server Error while deleting Roles", data: error })
    }
});

export default route;